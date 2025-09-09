const User = require('../models/user');
const Job = require('../models/job');
const MobilityRequest = require('../models/mobilityRequest');

exports.getDashboard = async (req, res) => { 
 try {
  const usersTotal = await User.countDocuments()
  const jobsTotal = await Job.countDocuments()
  const jobsAvailable = await Job.countDocuments({ isActive: true })
  const jobsUnavailable = await Job.countDocuments({ isActive: false })
  const mobilityRequestsTotal = await MobilityRequest.countDocuments()
  const mobilityRequestsAccepted = await MobilityRequest.countDocuments({status: 'completed'})
  const mobilityRequestsRejected = await MobilityRequest.countDocuments({status: 'rejected'})
  const mobilityRequestsPending = await MobilityRequest.countDocuments({status: { $ne: 'completed', $ne: 'rejected' }})

  res.status(200).json({
   usersTotal,
   jobsTotal,
   jobsAvailable,
   jobsUnavailable,
   mobilityRequestsTotal,
   mobilityRequestsAccepted,
   mobilityRequestsRejected,
   mobilityRequestsPending
  })
 } catch (error) {
  res.status(500).json({ message: 'Erreur serveur' })
 }
}