const Report = require('../models/report');
const User = require('../models/user');
const MobilityRequest = require('../models/mobilityRequest');
const Skill = require('../models/skill');

exports.generateSkillsGapReport = async (req, res) => {
  try {
    const { department } = req.query;
    const filter = { isActive: true };
    if (department) filter['profile.department'] = department;

    // Get all employees
    const employees = await User.find(filter)
      .populate('profile.skills.skill')
      .populate('manager');

    // Get all required skills from active jobs
    const jobs = await Job.find({ isActive: true }).populate('requiredSkills.skill');
    const requiredSkills = {};

    jobs.forEach(job => {
      job.requiredSkills.forEach(reqSkill => {
        const skillId = reqSkill.skill._id.toString();
        if (!requiredSkills[skillId]) {
          requiredSkills[skillId] = {
            skill: reqSkill.skill,
            minLevel: reqSkill.minLevel,
            count: 0
          };
        }
        requiredSkills[skillId].count++;
      });
    });

    // Analyze gaps
    const skillGaps = [];
    Object.values(requiredSkills).forEach(skillData => {
      const employeesWithSkill = employees.filter(emp => 
        emp.profile.skills.some(s => 
          s.skill._id.equals(skillData.skill._id) && s.level >= skillData.minLevel
        )
      ).length;

      skillGaps.push({
        skill: skillData.skill,
        requiredForJobs: skillData.count,
        employeesWithSkill,
        gapPercentage: ((employees.length - employeesWithSkill) / employees.length) * 100
      });
    });

    // Save report
    const report = new Report({
      title: `Skills Gap Report - ${department || 'All Departments'}`,
      type: 'skills_gap',
      parameters: { department },
      data: skillGaps,
      generatedBy: req.userId
    });

    await report.save();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generateMobilityTrendsReport = async (req, res) => {
  try {
    const { department, startDate, endDate } = req.query;
    const filter = {};
    
    if (department) filter['job.department'] = department;
    if (startDate) filter.createdAt = { $gte: new Date(startDate) };
    if (endDate) filter.createdAt = { ...filter.createdAt, $lte: new Date(endDate) };

    const requests = await MobilityRequest.find(filter)
      .populate('job', 'title department')
      .populate('employee', 'profile.firstName profile.lastName profile.department');

    // Calculate trends
    const statusCounts = {
      pending: 0,
      manager_approved: 0,
      hr_approved: 0,
      rejected: 0,
      completed: 0
    };

    const departmentTrends = {};
    const monthlyTrends = {};

    requests.forEach(request => {
      // Status counts
      statusCounts[request.status] = (statusCounts[request.status] || 0) + 1;

      // Department trends
      const dept = request.job.department;
      departmentTrends[dept] = departmentTrends[dept] || { total: 0, approved: 0 };
      departmentTrends[dept].total++;
      if (request.status === 'completed') departmentTrends[dept].approved++;

      // Monthly trends
      const monthYear = request.createdAt.toISOString().substring(0, 7);
      monthlyTrends[monthYear] = monthlyTrends[monthYear] || { total: 0, approved: 0 };
      monthlyTrends[monthYear].total++;
      if (request.status === 'completed') monthlyTrends[monthYear].approved++;
    });

    // Save report
    const report = new Report({
      title: `Mobility Trends Report - ${department || 'All Departments'}`,
      type: 'mobility_trends',
      parameters: { department, startDate, endDate },
      data: {
        statusCounts,
        departmentTrends,
        monthlyTrends,
        totalRequests: requests.length
      },
      generatedBy: req.userId
    });

    await report.save();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('generatedBy', 'profile.firstName profile.lastName');

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    const filter = {};
    
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const reports = await Report.find(filter)
      .populate('generatedBy', 'profile.firstName profile.lastName')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};