import Space from '../models/Space.js';

// @desc    Fetch all spaces (with basic search & filter)
// @route   GET /api/spaces
// @access  Public
export const getSpaces = async (req, res) => {
  const { city, category, type, search } = req.query;

  let query = { status: 'active' };

  if (city) {
    query['address.city'] = { $regex: city, $options: 'i' };
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { 'address.city': { $regex: search, $options: 'i' } },
      { 'address.street': { $regex: search, $options: 'i' } },
    ];
    delete query.status; // Let search return all active spaces
    query.status = 'active';
  }

  if (category) {
    query['deskTypes.type'] = category;
  }

  if (type) {
    query.spaceType = type;
  }

  try {
    const spaces = await Space.find(query).populate('operatorId', 'name email');
    res.json(spaces);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single space
// @route   GET /api/spaces/:id
// @access  Public
export const getSpaceById = async (req, res) => {
  try {
    const space = await Space.findById(req.params.id).populate('operatorId', 'name email profilePicture');

    if (space) {
      res.json(space);
    } else {
      res.status(404).json({ message: 'Space not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a space
// @route   POST /api/spaces
// @access  Private/Operator
export const createSpace = async (req, res) => {
  try {
    const spaceData = {
      ...req.body,
      operatorId: req.user._id,
      status: 'pending_approval',
      images: req.files ? req.files.map(f => f.path) : (req.body.images || []),
    };

    // Parse JSON strings from form data
    if (typeof spaceData.address === 'string') spaceData.address = JSON.parse(spaceData.address);
    if (typeof spaceData.location === 'string') spaceData.location = JSON.parse(spaceData.location);
    if (typeof spaceData.operatingHours === 'string') spaceData.operatingHours = JSON.parse(spaceData.operatingHours);
    if (typeof spaceData.amenities === 'string') spaceData.amenities = JSON.parse(spaceData.amenities);
    if (typeof spaceData.deskTypes === 'string') spaceData.deskTypes = JSON.parse(spaceData.deskTypes);
    if (typeof spaceData.pricing === 'string') spaceData.pricing = JSON.parse(spaceData.pricing);
    if (typeof spaceData.capacity === 'string') spaceData.capacity = JSON.parse(spaceData.capacity);

    const space = await Space.create(spaceData);
    res.status(201).json(space);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Update a space
// @route   PUT /api/spaces/:id
// @access  Private/Operator
export const updateSpace = async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);

    if (space) {
      if (space.operatorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized to update this space' });
      }

      const updatedSpace = await Space.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedSpace);
    } else {
      res.status(404).json({ message: 'Space not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating space' });
  }
};

// @desc    Get operator's own spaces
// @route   GET /api/spaces/my-spaces
// @access  Private/Operator
export const getMySpaces = async (req, res) => {
  try {
    const spaces = await Space.find({ operatorId: req.user._id }).sort({ createdAt: -1 });
    res.json(spaces);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
