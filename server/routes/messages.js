const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Inquiry = require('../models/Inquiry');
const { getIo } = require('../socket');
const { protect } = require('../middleware/auth');
const Notification = require('../models/Notification');

// Get messages for a specific inquiry
router.get('/:inquiryId', protect, async (req, res) => {
  try {
    const messages = await Message.find({ inquiry: req.params.inquiryId })
      .populate('sender', 'name profilePicture role')
      .populate('receiver', 'name profilePicture role')
      .sort('createdAt');
      
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
});

// Send a new message
router.post('/', protect, async (req, res) => {
  try {
    const { inquiryId, receiverId, text } = req.body;

    if (!text || !inquiryId || !receiverId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const message = new Message({
      sender: req.user._id,
      receiver: receiverId,
      inquiry: inquiryId,
      text
    });

    await message.save();

    // Populate sender info before emitting
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name profilePicture role');

    // Emit socket event to the receiver's private room
    const io = getIo();
    io.to(receiverId.toString()).emit('newMessage', populatedMessage);
    
    // Create and emit persistent notification
    try {
      const notification = await Notification.create({
        recipient: receiverId,
        title: 'New Message',
        message: `You have a new message from ${populatedMessage.sender.name}`,
        type: 'system',
        link: '/dashboard/inquiries'
      });
      io.to(receiverId.toString()).emit('new_notification', notification);
    } catch (err) {
      console.error('Socket.io error emitting message notification:', err);
    }

    // Also emit to the sender's own room so their other devices update if needed, though they usually append locally
    io.to(req.user._id.toString()).emit('newMessage', populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error sending message' });
  }
});

// Mark messages as read
router.patch('/read/:inquiryId', protect, async (req, res) => {
  try {
    await Message.updateMany(
      { inquiry: req.params.inquiryId, receiver: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking messages read:', error);
    res.status(500).json({ message: 'Server error marking read' });
  }
});

module.exports = router;
