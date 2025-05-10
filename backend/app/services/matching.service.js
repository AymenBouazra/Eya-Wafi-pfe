const User = require('../models/user');
const Job = require('../models/job');

class MatchingService {
  async matchEmployeeToJobs(employeeId) {
    const employee = await User.findById(employeeId)
      .populate('profile.skills.skill')
      .populate('manager');
    
    if (!employee) {
      throw new Error('Employee not found');
    }

    const jobs = await Job.find({ isActive: true })
      .populate('requiredSkills.skill')
      .populate('postedBy', 'profile.firstName profile.lastName');

    const matches = jobs.map(job => {
      const score = this.calculateMatchScore(employee, job);
      const skillMatches = this.getSkillMatches(employee, job);
      
      return {
        job,
        score,
        skillMatches,
        isInSameDepartment: employee.profile.department === job.department,
        matchesAspirations: employee.profile.aspirations.includes(job.title)
      };
    });

    return matches.sort((a, b) => b.score - a.score);
  }

  calculateMatchScore(employee, job) {
    let score = 0;
    
    // Skill matching (50% of score)
    employee.profile.skills.forEach(empSkill => {
      job.requiredSkills.forEach(jobSkill => {
        if (empSkill.skill._id.equals(jobSkill.skill._id)) {
          // More weight if skill level meets or exceeds requirement
          if (empSkill.level >= jobSkill.minLevel) {
            score += 30 * (jobSkill.minLevel / 5); // Max 30 points per skill
          } else {
            score += 10 * (empSkill.level / jobSkill.minLevel); // Partial points
          }
        }
      });
    });

    // Department bonus (20% of score)
    if (employee.profile.department === job.department) {
      score += 20;
    }

    // Aspirations bonus (15% of score)
    if (employee.profile.aspirations.includes(job.title)) {
      score += 15;
    }

    // Experience bonus (15% of score)
    const relevantExperience = employee.profile.experience.filter(exp => 
      exp.title.toLowerCase() === job.title.toLowerCase()
    ).length;
    score += Math.min(relevantExperience * 5, 15);

    return Math.min(Math.round(score), 100);
  }

  getSkillMatches(employee, job) {
    return job.requiredSkills.map(jobSkill => {
      const employeeSkill = employee.profile.skills.find(s => 
        s.skill._id.equals(jobSkill.skill._id)
      );
      
      return {
        skill: jobSkill.skill,
        requiredLevel: jobSkill.minLevel,
        employeeLevel: employeeSkill ? employeeSkill.level : 0,
        meetsRequirement: employeeSkill ? employeeSkill.level >= jobSkill.minLevel : false
      };
    });
  }

  async findCandidatesForJob(jobId) {
    const job = await Job.findById(jobId)
      .populate('requiredSkills.skill');
    
    if (!job) {
      throw new Error('Job not found');
    }

    const users = await User.find({ isActive: true, role: 'employee' })
      .populate('profile.skills.skill')
      .populate('manager');

    const candidates = users.map(user => {
      const score = this.calculateMatchScore(user, job);
      const skillMatches = this.getSkillMatches(user, job);
      
      return {
        user,
        score,
        skillMatches,
        isInSameDepartment: user.profile.department === job.department,
        matchesAspirations: user.profile.aspirations.includes(job.title)
      };
    });

    return candidates
      .filter(c => c.score >= 50) // Only show candidates with at least 50% match
      .sort((a, b) => b.score - a.score);
  }
}

module.exports = new MatchingService();