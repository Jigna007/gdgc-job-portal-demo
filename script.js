class JobPortal {
  constructor() {
    console.log("JobPortal constructor called");
    this.jobs = [];
    this.filteredJobs = [];
    this.currentUser = "seeker";
    this.appliedJobs = [];
    this.editingJobId = null;
    this.applications = {};
    this.jobViews = {};
    this.candidateProfiles = {};

    this.init();
  }

  async init() {
    console.log("JobPortal init called");
    try {
      await this.loadJobs();
      console.log("Jobs loaded successfully");
      this.setupEventListeners();
      console.log("Event listeners set up");
      this.renderJobs();
      console.log("Jobs rendered");
      this.updateJobsCount();
      console.log("Job count updated");
    } catch (error) {
      console.error("Error initializing JobPortal:", error);
      console.log("Falling back to sample data");
      this.loadSampleJobs();
      this.setupEventListeners();
      this.renderJobs();
      this.updateJobsCount();
    }
  }

  async loadJobs() {
    console.log("Loading jobs from API...");

    // For CodeSandbox, try a quick API call with short timeout
    try {
      console.log("Trying quick API call for CodeSandbox...");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500); // Very short timeout

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          signal: controller.signal,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log(
          "Quick API call successful, got data:",
          data.length,
          "items"
        );

        // Transform the data to job format
        this.jobs = this.transformApiDataToJobs(data.slice(0, 15)); // Limit to 15 items
        this.filteredJobs = [...this.jobs];
        this.initializeApplications();
        console.log("Jobs loaded successfully from API");
        return; // Success, exit the function
      }
    } catch (error) {
      console.log(
        "Quick API failed, falling back to sample data:",
        error.message
      );
    }

    // If API fails, immediately use sample data
    console.log("Using sample data for reliable loading");
    throw new Error("API failed, using sample data");
  }

  transformApiDataToJobs(data) {
    return data.map((item, index) => ({
      id: item.id || index + 1,
      title: this.generateJobTitle(
        item.title || item.name || Job ${index + 1}
      ),
      company: this.generateCompanyName(item.userId || item.email || index),
      location: this.getRandomLocation(),
      salary: this.getRandomSalary(),
      type: this.getRandomJobType(),
      experience: this.getRandomExperience(),
      description: this.generateJobDescription(item.body || item.title || ""),
      requirements: [
        "Bachelor's degree",
        "2+ years experience",
        "Strong communication skills",
      ],
      benefits: ["Health insurance", "Flexible hours", "Remote work options"],
      posted: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      isCustom: false,
      companySize: this.getRandomCompanySize(),
      industry: this.getRandomIndustry(),
      status: "Active",
      views: Math.floor(Math.random() * 500) + 50,
      applicationCount: Math.floor(Math.random() * 25) + 1,
    }));
  }

  generateJobTitle(baseTitle) {
    const jobTitles = [
      "Senior Frontend Developer",
      "Backend Engineer",
      "Full Stack Developer",
      "Product Manager",
      "Data Scientist",
      "UX Designer",
      "DevOps Engineer",
      "Software Engineer",
      "Marketing Manager",
      "Sales Representative",
    ];

    // Use hash of baseTitle to get consistent title
    const hash = this.simpleHash(baseTitle);
    return jobTitles[hash % jobTitles.length];
  }

  generateCompanyName(seed) {
    const companies = [
      "TechCorp Inc.",
      "InnovateLabs",
      "DataFlow Analytics",
      "BrandForward",
      "Capital Ventures",
      "Future Systems",
      "Digital Solutions",
      "Smart Technologies",
      "Global Dynamics",
      "NextGen Software",
    ];

    const hash = typeof seed === "string" ? this.simpleHash(seed) : seed;
    return companies[hash % companies.length];
  }

  generateJobDescription(baseText) {
    const descriptions = [
      "Join our dynamic team and contribute to cutting-edge projects in a collaborative environment.",
      "We're looking for a talented professional to help drive innovation and growth.",
      "Exciting opportunity to work with modern technologies and make a real impact.",
      "Be part of a fast-growing company with excellent career development opportunities.",
      "Work with a diverse team of experts on challenging and rewarding projects.",
    ];

    const hash = this.simpleHash(baseText);
    return descriptions[hash % descriptions.length];
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  getRandomLocation() {
    const locations = [
      "San Francisco, CA",
      "New York, NY",
      "Seattle, WA",
      "Austin, TX",
      "Boston, MA",
      "Chicago, IL",
      "Los Angeles, CA",
      "Denver, CO",
      "Atlanta, GA",
      "Remote",
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  loadSampleJobs() {
    console.log("Loading sample jobs data...");
    this.jobs = [
      {
        id: 1,
        title: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        salary: "$120,000 - $180,000",
        type: "Full-time",
        experience: "Senior",
        description:
          "We're looking for a skilled Senior Frontend Developer to join our dynamic team.",
        requirements: [
          "5+ years of experience with React and modern JavaScript",
          "Strong knowledge of TypeScript and Next.js",
          "Experience with state management (Redux, Zustand)",
          "Understanding of web performance optimization",
        ],
        benefits: [
          "Competitive salary and equity package",
          "Health, dental, and vision insurance",
          "Flexible work arrangements",
          "Professional development budget",
        ],
        posted: new Date().toISOString(),
        isCustom: false,
        companySize: "Large",
        industry: "Technology",
        status: "Active",
        views: 342,
        applicationCount: 18,
      },
      {
        id: 2,
        title: "Product Manager",
        company: "InnovateLabs",
        location: "New York, NY",
        salary: "$130,000 - $200,000",
        type: "Full-time",
        experience: "Mid",
        description:
          "Strategic product management role for innovative B2B solutions.",
        requirements: [
          "3+ years in product management",
          "Experience with agile methodologies",
          "Strong analytical skills",
          "Leadership experience",
        ],
        benefits: [
          "Competitive salary",
          "Stock options",
          "Health benefits",
          "Unlimited PTO",
        ],
        posted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isCustom: false,
        companySize: "Medium",
        industry: "Technology",
        status: "Active",
        views: 256,
        applicationCount: 12,
      },
      {
        id: 3,
        title: "Data Scientist",
        company: "DataFlow Analytics",
        location: "Seattle, WA",
        salary: "$95,000 - $140,000",
        type: "Full-time",
        experience: "Mid",
        description:
          "Join our data science team to build cutting-edge ML models and analytics solutions.",
        requirements: [
          "Masters in Data Science or related field",
          "Python, R, SQL expertise",
          "Machine learning and statistical modeling",
          "Experience with cloud platforms",
        ],
        benefits: [
          "Health insurance",
          "Stock options",
          "Learning budget",
          "Remote work options",
        ],
        posted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        isCustom: false,
        companySize: "Medium",
        industry: "Technology",
      },
      {
        id: 4,
        title: "Marketing Specialist",
        company: "BrandForward",
        location: "Austin, TX",
        salary: "$45,000 - $65,000",
        type: "Full-time",
        experience: "Entry",
        description:
          "Looking for a creative marketing specialist to drive brand awareness and customer engagement.",
        requirements: [
          "Bachelor's in Marketing or related field",
          "Social media marketing experience",
          "Content creation skills",
          "Analytics tools knowledge",
        ],
        benefits: [
          "Health benefits",
          "Creative environment",
          "Growth opportunities",
          "Flexible hours",
        ],
        posted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        isCustom: false,
        companySize: "Startup",
        industry: "Marketing",
      },
      {
        id: 5,
        title: "Financial Analyst",
        company: "Capital Ventures",
        location: "Chicago, IL",
        salary: "$70,000 - $95,000",
        type: "Full-time",
        experience: "Entry",
        description:
          "Entry-level financial analyst position with excellent growth opportunities.",
        requirements: [
          "Finance or Economics degree",
          "Excel proficiency",
          "Analytical thinking",
          "Strong communication skills",
        ],
        benefits: [
          "Comprehensive benefits",
          "Professional development",
          "Bonus potential",
          "Career progression",
        ],
        posted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        isCustom: false,
        companySize: "Large",
        industry: "Finance",
      },
    ];
    this.filteredJobs = [...this.jobs];
    this.initializeApplications();
    console.log("Sample jobs loaded successfully:", this.jobs.length, "jobs");
  }

  initializeApplications() {
    this.jobs.forEach((job) => {
      this.applications[job.id] = [];
      for (let i = 0; i < job.applicationCount; i++) {
        const applicationId = app_${job.id}_${i + 1};
        const candidate = this.generateCandidate(applicationId);
        this.candidateProfiles[applicationId] = candidate;

        this.applications[job.id].push({
          id: applicationId,
          candidateId: applicationId,
          jobId: job.id,
          status: this.getRandomApplicationStatus(),
          appliedDate: new Date(
            Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000
          ).toISOString(),
          notes: "",
        });
      }
    });
  }

  generateCandidate(candidateId) {
    const firstNames = [
      "John",
      "Sarah",
      "Michael",
      "Emily",
      "David",
      "Jessica",
      "Robert",
      "Ashley",
      "James",
      "Amanda",
    ];
    const lastNames = [
      "Smith",
      "Johnson",
      "Brown",
      "Davis",
      "Wilson",
      "Moore",
      "Taylor",
      "Anderson",
      "Thomas",
      "Jackson",
    ];

    return {
      id: candidateId,
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
        lastNames[Math.floor(Math.random() * lastNames.length)]
      }`,
      email: ${candidateId}@email.com,
      phone: `(555) ${Math.floor(Math.random() * 900) + 100}-${
        Math.floor(Math.random() * 9000) + 1000
      }`,
      experience: ${Math.floor(Math.random() * 10) + 1} years,
      skills: this.getRandomSkills(),
      education: this.getRandomEducation(),
      resume: "View Resume",
      location: this.getRandomLocation(),
    };
  }

  getRandomSkills() {
    const allSkills = [
      "JavaScript",
      "React",
      "Node.js",
      "Python",
      "Java",
      "TypeScript",
      "AWS",
      "Docker",
      "Git",
      "SQL",
      "MongoDB",
      "Express.js",
    ];
    const numSkills = Math.floor(Math.random() * 6) + 3;
    return allSkills.sort(() => 0.5 - Math.random()).slice(0, numSkills);
  }

  getRandomEducation() {
    const degrees = [
      "Bachelor's in Computer Science",
      "Master's in Software Engineering",
      "Bachelor's in Information Technology",
      "Master's in Computer Science",
    ];
    return degrees[Math.floor(Math.random() * degrees.length)];
  }

  getRandomApplicationStatus() {
    const statuses = [
      "New",
      "Reviewed",
      "Shortlisted",
      "Interviewed",
      "Rejected",
      "Hired",
    ];
    const weights = [0.3, 0.25, 0.2, 0.15, 0.08, 0.02];
    const random = Math.random();
    let weightSum = 0;

    for (let i = 0; i < statuses.length; i++) {
      weightSum += weights[i];
      if (random <= weightSum) {
        return statuses[i];
      }
    }
    return "New";
  }

  getRandomJobType() {
    const types = ["Full-time", "Part-time", "Contract", "Remote"];
    return types[Math.floor(Math.random() * types.length)];
  }

  getRandomExperience() {
    const levels = ["Entry", "Mid", "Senior"];
    return levels[Math.floor(Math.random() * levels.length)];
  }

  getRandomSalary() {
    const salaryRanges = [
      "$35,000 - $50,000",
      "$45,000 - $65,000",
      "$55,000 - $75,000",
      "$65,000 - $85,000",
      "$75,000 - $95,000",
      "$85,000 - $110,000",
      "$95,000 - $125,000",
      "$110,000 - $140,000",
      "$125,000 - $160,000",
      "$140,000 - $180,000",
      "$160,000 - $220,000",
    ];
    return salaryRanges[Math.floor(Math.random() * salaryRanges.length)];
  }

  getRandomCompanySize() {
    const sizes = ["Startup", "Medium", "Large"];
    return sizes[Math.floor(Math.random() * sizes.length)];
  }

  getRandomIndustry() {
    const industries = [
      "Technology",
      "Finance",
      "Healthcare",
      "Education",
      "Marketing",
    ];
    return industries[Math.floor(Math.random() * industries.length)];
  }

  setupEventListeners() {
    try {
      // Role dropdown functionality
      const dropdown = document.querySelector(".role-dropdown");
      const dropdownSelected = document.querySelector(
        ".role-dropdown-selected"
      );
      const dropdownMenu = document.querySelector(".role-dropdown-menu");
      const dropdownOptions = document.querySelectorAll(
        ".role-dropdown-option"
      );

      if (
        !dropdown ||
        !dropdownSelected ||
        !dropdownMenu ||
        dropdownOptions.length === 0
      ) {
        console.error("Dropdown elements not found");
        return;
      }

      // Toggle dropdown on click
      dropdownSelected.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropdown.classList.toggle("open");
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove("open");
        }
      });

      // Handle dropdown option selection
      dropdownOptions.forEach((option) => {
        option.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          // Remove selected class from all options
          dropdownOptions.forEach((opt) => {
            opt.classList.remove("selected");
          });

          // Add selected class to clicked option
          e.target.classList.add("selected");

          // Update current user role
          this.currentUser = e.target.dataset.role;

          const roleText = e.target.textContent.trim();
          const roleTextElement = document.querySelector(".role-text");
          if (roleTextElement) {
            roleTextElement.textContent = roleText;
          }

          dropdown.setAttribute("data-active", this.currentUser);

          // Close dropdown
          dropdown.classList.remove("open");

          // Update UI based on role
          this.toggleAdminPanel();
          this.renderJobs();
        });
      });

      // Other event listeners with error handling
      const clearFiltersBtn = document.getElementById("clearFilters");
      if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener("click", () => {
          this.clearAllFilters();
        });
      }

      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          this.filterJobs();
          this.updateClearButtonState();
        });
      }

      // Filter checkboxes
      const filterCheckboxes = document.querySelectorAll(
        '.filter-group input[type="checkbox"]'
      );
      filterCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
          this.filterJobs();
          this.updateClearButtonState();
        });
      });

      const sortSelect = document.getElementById("sortSelect");
      if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
          this.sortJobs(e.target.value);
        });
      }

      // Modal event listeners
      const closeModal = document.querySelector(".close");
      if (closeModal) {
        closeModal.addEventListener("click", () => {
          const jobModal = document.getElementById("jobModal");
          if (jobModal) {
            jobModal.style.display = "none";
          }
        });
      }

      window.addEventListener("click", (e) => {
        const jobModal = document.getElementById("jobModal");
        if (e.target === jobModal) {
          jobModal.style.display = "none";
        }
      });

      // Job form event listeners
      const jobForm = document.getElementById("jobForm");
      if (jobForm) {
        jobForm.addEventListener("submit", (e) => {
          e.preventDefault();
          this.handleJobSubmit();
        });
      }

      const cancelEdit = document.getElementById("cancelEdit");
      if (cancelEdit) {
        cancelEdit.addEventListener("click", () => {
          this.resetJobForm();
        });
      }

      // Initialize filter state
      this.updateClearButtonState();
    } catch (error) {
      console.error("Error setting up event listeners:", error);
    }
  }

  clearAllFilters() {
    document.getElementById("searchInput").value = "";

    document
      .querySelectorAll('.filter-group input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.checked = false;
      });

    document.getElementById("sortSelect").value = "date";

    this.filterJobs();
    this.updateClearButtonState();

    this.showToast("All filters cleared");
  }

  updateClearButtonState() {
    const searchInput = document.getElementById("searchInput").value;
    const checkedFilters = document.querySelectorAll(
      '.filter-group input[type="checkbox"]:checked'
    );
    const sortSelect = document.getElementById("sortSelect").value;

    const hasActiveFilters =
      searchInput.length > 0 ||
      checkedFilters.length > 0 ||
      sortSelect !== "date";
    const clearButton = document.getElementById("clearFilters");

    clearButton.disabled = !hasActiveFilters;
  }

  toggleAdminPanel() {
    try {
      const adminPanel = document.getElementById("adminPanel");
      const seekerStats = document.getElementById("seekerStats");
      const recruiterStats = document.getElementById("recruiterStats");

      // Show/hide sidebar elements based on role
      const filterSections = document.querySelectorAll(".filter-section");
      const searchContainer = document.querySelector(".search-container");
      const clearFilters = document.getElementById("clearFilters");
      const activeFilters = document.getElementById("activeFilters");
      const jobsHeader = document.querySelector(".jobs-header");

      if (adminPanel) {
        adminPanel.style.display =
          this.currentUser === "recruiter" ? "block" : "none";
      }

      if (seekerStats) {
        seekerStats.style.display =
          this.currentUser === "seeker" ? "flex" : "none";
      }

      if (recruiterStats) {
        recruiterStats.style.display =
          this.currentUser === "recruiter" ? "flex" : "none";
      }

      // Toggle filter sections visibility
      filterSections.forEach((section) => {
        section.style.display =
          this.currentUser === "seeker" ? "block" : "none";
      });

      if (searchContainer) {
        searchContainer.style.display =
          this.currentUser === "seeker" ? "block" : "none";
      }

      if (clearFilters) {
        clearFilters.style.display =
          this.currentUser === "seeker" ? "block" : "none";
      }

      if (activeFilters) {
        activeFilters.style.display =
          this.currentUser === "seeker" ? "block" : "none";
      }

      // Toggle jobs header visibility
      if (jobsHeader) {
        jobsHeader.style.display =
          this.currentUser === "seeker" ? "flex" : "none";
      }

      // Toggle body class for styling
      if (this.currentUser === "recruiter") {
        document.body.classList.add("recruiter-mode");
      } else {
        document.body.classList.remove("recruiter-mode");
      }

      // Update hero text
      this.updateHeroText();

      if (this.currentUser === "recruiter") {
        this.updateRecruiterStats();
      }
    } catch (error) {
      console.error("Error toggling admin panel:", error);
    }
  }

  updateRecruiterStats() {
    try {
      const myJobs = this.jobs.filter((job) => job.isCustom);
      const totalApplications = myJobs.reduce(
        (sum, job) => sum + job.applicationCount,
        0
      );
      const totalViews = myJobs.reduce((sum, job) => sum + job.views, 0);
      const avgViews =
        myJobs.length > 0 ? Math.round(totalViews / myJobs.length) : 0;
      const conversionRate =
        totalViews > 0 ? Math.round((totalApplications / totalViews) * 100) : 0;

      const myJobsCountEl = document.getElementById("myJobsCount");
      const totalApplicationsEl = document.getElementById("totalApplications");
      const avgViewsEl = document.getElementById("avgViews");
      const conversionRateEl = document.getElementById("conversionRate");

      if (myJobsCountEl) myJobsCountEl.textContent = myJobs.length;
      if (totalApplicationsEl)
        totalApplicationsEl.textContent = totalApplications;
      if (avgViewsEl) avgViewsEl.textContent = avgViews;
      if (conversionRateEl) conversionRateEl.textContent = ${conversionRate}%;
    } catch (error) {
      console.error("Error updating recruiter stats:", error);
    }
  }

  updateHeroText() {
    const heroTitle = document.getElementById("heroTitle");
    const heroSubtitle = document.getElementById("heroSubtitle");

    if (this.currentUser === "recruiter") {
      heroTitle.textContent = "Find Top Talent";
      heroSubtitle.textContent =
        "Connect with qualified candidates and build your dream team";
    } else {
      heroTitle.textContent = "Land Your Dream Job";
      heroSubtitle.textContent =
        "Discover opportunities from top companies worldwide";
    }
  }

  filterJobs() {
    const searchTerm = document
      .getElementById("searchInput")
      .value.toLowerCase();
    const selectedTypes = Array.from(
      document.querySelectorAll("#jobTypeFilters input:checked")
    ).map((cb) => cb.value);
    const selectedExperience = Array.from(
      document.querySelectorAll("#experienceFilters input:checked")
    ).map((cb) => cb.value);
    const selectedSalaryRanges = Array.from(
      document.querySelectorAll("#salaryFilters input:checked")
    ).map((cb) => cb.value);
    const selectedCompanySizes = Array.from(
      document.querySelectorAll("#companySizeFilters input:checked")
    ).map((cb) => cb.value);
    const selectedIndustries = Array.from(
      document.querySelectorAll("#industryFilters input:checked")
    ).map((cb) => cb.value);
    const selectedDateRanges = Array.from(
      document.querySelectorAll("#dateFilters input:checked")
    ).map((cb) => cb.value);

    this.filteredJobs = this.jobs.filter((job) => {
      const matchesSearch =
        !searchTerm ||
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.location.toLowerCase().includes(searchTerm);

      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(job.type);
      const matchesExperience =
        selectedExperience.length === 0 ||
        selectedExperience.includes(job.experience);

      const matchesSalary =
        selectedSalaryRanges.length === 0 ||
        selectedSalaryRanges.some((range) => {
          const salaryNum = this.extractSalaryNumber(job.salary);
          switch (range) {
            case "0-50k":
              return salaryNum < 50000;
            case "50k-80k":
              return salaryNum >= 50000 && salaryNum < 80000;
            case "80k-120k":
              return salaryNum >= 80000 && salaryNum < 120000;
            case "120k+":
              return salaryNum >= 120000;
            default:
              return false;
          }
        });

      const matchesCompanySize =
        selectedCompanySizes.length === 0 ||
        selectedCompanySizes.includes(job.companySize);
      const matchesIndustry =
        selectedIndustries.length === 0 ||
        selectedIndustries.includes(job.industry);

      const matchesDate =
        selectedDateRanges.length === 0 ||
        selectedDateRanges.some((range) => {
          const jobDate = new Date(job.posted);
          const now = new Date();
          const diffDays = Math.floor((now - jobDate) / (1000 * 60 * 60 * 24));

          switch (range) {
            case "today":
              return diffDays === 0;
            case "week":
              return diffDays <= 7;
            case "month":
              return diffDays <= 30;
            default:
              return false;
          }
        });

      return (
        matchesSearch &&
        matchesType &&
        matchesExperience &&
        matchesSalary &&
        matchesCompanySize &&
        matchesIndustry &&
        matchesDate
      );
    });

    this.renderJobs();
    this.updateJobsCount();
  }

  extractSalaryNumber(salaryString) {
    const match = salaryString.match(/\$?([\d,]+)/);
    return match ? parseInt(match[1].replace(/,/g, "")) : 0;
  }

  sortJobs(criteria) {
    switch (criteria) {
      case "title":
        this.filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "company":
        this.filteredJobs.sort((a, b) => a.company.localeCompare(b.company));
        break;
      case "salary":
        this.filteredJobs.sort((a, b) => {
          const getSalary = (salaryString) =>
            this.extractSalaryNumber(salaryString);
          return getSalary(b.salary) - getSalary(a.salary);
        });
        break;
      case "date":
      default:
        this.filteredJobs.sort(
          (a, b) => new Date(b.posted) - new Date(a.posted)
        );
        break;
    }
    this.renderJobs();
  }

  renderJobs() {
    try {
      const jobsList = document.getElementById("jobsList");

      if (!jobsList) {
        console.error("jobsList element not found");
        return;
      }

      if (this.filteredJobs.length === 0) {
        jobsList.innerHTML = `
                <div class="no-jobs">
                    <h3>No jobs found</h3>
                    <p>Try adjusting your filters or search terms</p>
                </div>
            `;
        return;
      }

      const jobsToDisplay =
        this.currentUser === "recruiter"
          ? this.filteredJobs.slice(0, 5)
          : this.filteredJobs;

      jobsList.innerHTML = jobsToDisplay
        .map(
          (job) => `
            <div class="job-card ${job.status.toLowerCase()}" data-job-id="${
            job.id
          }">
                <div class="job-header">
                    <div class="job-info">
                        <h3 class="job-title">${job.title}</h3>
                        <p class="job-company">${job.company}</p>
                        <p class="job-location">📍 ${job.location}</p>
                        ${
                          this.currentUser === "recruiter"
                            ? `
                            <div class="job-metrics">
                                <span class="job-metric">👁 ${
                                  job.views
                                } views</span>
                                <span class="job-metric">📝 ${
                                  job.applicationCount
                                } applications</span>
                                <span class="job-status-badge status-${job.status.toLowerCase()}">${
                                job.status
                              }</span>
                            </div>
                        `
                            : ""
                        }
                    </div>
                    <div class="job-salary">${job.salary}</div>
                </div>
                <div class="job-meta">
                    <span class="job-tag">${job.type}</span>
                    <span class="job-tag">${job.experience}</span>
                    <span class="job-tag">${job.companySize}</span>
                    <span class="job-tag">${job.industry}</span>
                </div>
                <p class="job-description">${job.description}</p>
                <div class="job-actions">
                    ${
                      this.currentUser === "seeker"
                        ? `
                        <button class="btn-apply" onclick="window.jobPortal && window.jobPortal.applyForJob(${
                          job.id
                        })" ${
                            this.appliedJobs.includes(job.id) ? "disabled" : ""
                          }>
                            <span>${
                              this.appliedJobs.includes(job.id)
                                ? "Applied"
                                : "Apply Now"
                            }</span>
                        </button>
                    `
                        : ""
                    }
                    <button class="btn-details" onclick="window.jobPortal && window.jobPortal.showJobDetails(${
                      job.id
                    })">
                        <span>View Details</span>
                    </button>
                    ${
                      this.currentUser === "recruiter"
                        ? `
                        <button class="btn btn-primary" onclick="window.jobPortal && window.jobPortal.viewApplications(${
                          job.id
                        })">
                            View Applications (${job.applicationCount})
                        </button>
                        ${
                          job.isCustom
                            ? `
                            <button class="btn btn-secondary" onclick="window.jobPortal && window.jobPortal.editJob(${job.id})">Edit</button>
                            <button class="btn btn-secondary" onclick="window.jobPortal && window.jobPortal.deleteJob(${job.id})">Delete</button>
                        `
                            : ""
                        }
                    `
                        : ""
                    }
                </div>
            </div>
        `
        )
        .join("");

      // Add staggered animation to job cards
      document.querySelectorAll(".job-card").forEach((card, index) => {
        setTimeout(() => {
          card.style.animationDelay = ${index * 100}ms;
        }, index * 100);
      });
    } catch (error) {
      console.error("Error rendering jobs:", error);
      const jobsList = document.getElementById("jobsList");
      if (jobsList) {
        jobsList.innerHTML = `
          <div class="no-jobs">
            <h3>Error loading jobs</h3>
            <p>Please refresh the page to try again</p>
          </div>
        `;
      }
    }
  }

  updateJobsCount() {
    try {
      const totalCount = this.filteredJobs.length;
      const displayCount =
        this.currentUser === "recruiter" ? Math.min(totalCount, 5) : totalCount;

      const jobsCount = document.getElementById("jobsCount");

      if (!jobsCount) {
        console.error("jobsCount element not found");
        return;
      }

      if (this.currentUser === "recruiter" && totalCount > 5) {
        jobsCount.textContent = Showing ${displayCount} of ${totalCount} jobs;
      } else {
        jobsCount.textContent = `${displayCount} job${
          displayCount !== 1 ? "s" : ""
        } found`;
      }
    } catch (error) {
      console.error("Error updating jobs count:", error);
    }
  }

  applyForJob(jobId) {
    if (!this.appliedJobs.includes(jobId)) {
      this.appliedJobs.push(jobId);
      this.renderJobs();
      this.showToast("Application submitted successfully!");
    }
  }

  showJobDetails(jobId) {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) return;

    const modalContent = document.getElementById("modalContent");
    modalContent.innerHTML = `
            <h2>${job.title}</h2>
            <h3>${job.company}</h3>
            <p><strong>Location:</strong> ${job.location}</p>
            <p><strong>Salary:</strong> ${job.salary}</p>
            <p><strong>Type:</strong> ${job.type}</p>
            <p><strong>Experience:</strong> ${job.experience}</p>
            <p><strong>Company Size:</strong> ${job.companySize}</p>
            <p><strong>Industry:</strong> ${job.industry}</p>
            
            <h4>Description</h4>
            <p>${job.description}</p>
            
            <h4>Requirements</h4>
            <ul>
                ${job.requirements.map((req) => <li>${req}</li>).join("")}
            </ul>
            
            <h4>Benefits</h4>
            <ul>
                ${job.benefits.map((benefit) => <li>${benefit}</li>).join("")}
            </ul>
            
            <div class="modal-actions" style="margin-top: 2rem;">
                <button class="btn-apply" onclick="window.jobPortal && window.jobPortal.applyForJob(${
                  job.id
                }); document.getElementById('jobModal').style.display = 'none';" ${
      this.appliedJobs.includes(job.id) ? "disabled" : ""
    }>
                    <span>${
                      this.appliedJobs.includes(job.id)
                        ? "Applied"
                        : "Apply Now"
                    }</span>
                </button>
            </div>
        `;

    document.getElementById("jobModal").style.display = "block";
  }

  viewApplications(jobId) {
    const job = this.jobs.find((j) => j.id === jobId);
    const applications = this.applications[jobId] || [];

    if (!job) return;

    const modalContent = document.getElementById("applicationsModalContent");
    modalContent.innerHTML = `
        <h2>Applications for: ${job.title}</h2>
        <p><strong>Company:</strong> ${job.company}</p>
        <p><strong>Total Applications:</strong> ${applications.length}</p>
        
        <div class="application-filters">
            <select id="statusFilter" onchange="window.jobPortal && window.jobPortal.filterApplications(${jobId})">
                <option value="">All Status</option>
                <option value="New">New</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interviewed">Interviewed</option>
                <option value="Rejected">Rejected</option>
                <option value="Hired">Hired</option>
            </select>
        </div>
        
        <div id="applicationsList">
            ${this.renderApplicationsList(applications)}
        </div>
    `;

    document.getElementById("applicationsModal").style.display = "block";
  }

  renderApplicationsList(applications) {
    if (applications.length === 0) {
      return "<p>No applications found.</p>";
    }

    return applications
      .map((app) => {
        const candidate = this.candidateProfiles[app.candidateId];
        const statusClass = app.status.toLowerCase().replace(" ", "-");

        return `
            <div class="application-card">
                <div class="application-header">
                    <div class="candidate-info">
                        <h4>${candidate.name}</h4>
                        <p>${candidate.email} | ${candidate.phone}</p>
                        <p>📍 ${candidate.location} | 💼 ${
          candidate.experience
        }</p>
                    </div>
                    <div class="application-status">
                        <select class="status-select" onchange="window.jobPortal && window.jobPortal.updateApplicationStatus('${
                          app.id
                        }', this.value)">
                            <option value="New" ${
                              app.status === "New" ? "selected" : ""
                            }>New</option>
                            <option value="Reviewed" ${
                              app.status === "Reviewed" ? "selected" : ""
                            }>Reviewed</option>
                            <option value="Shortlisted" ${
                              app.status === "Shortlisted" ? "selected" : ""
                            }>Shortlisted</option>
                            <option value="Interviewed" ${
                              app.status === "Interviewed" ? "selected" : ""
                            }>Interviewed</option>
                            <option value="Rejected" ${
                              app.status === "Rejected" ? "selected" : ""
                            }>Rejected</option>
                            <option value="Hired" ${
                              app.status === "Hired" ? "selected" : ""
                            }>Hired</option>
                        </select>
                    </div>
                </div>
                <div class="candidate-details">
                    <p><strong>Skills:</strong> ${candidate.skills.join(
                      ", "
                    )}</p>
                    <p><strong>Education:</strong> ${candidate.education}</p>
                    <p><strong>Applied:</strong> ${new Date(
                      app.appliedDate
                    ).toLocaleDateString()}</p>
                </div>
                <div class="application-actions">
                    <button class="btn btn-primary" onclick="window.jobPortal && window.jobPortal.viewCandidateProfile('${
                      app.candidateId
                    }')">
                        View Profile
                    </button>
                    <button class="btn btn-secondary" onclick="window.jobPortal && window.jobPortal.addCandidateNote('${
                      app.id
                    }')">
                        Add Note
                    </button>
                </div>
            </div>
        `;
      })
      .join("");
  }

  filterApplications(jobId) {
    const statusFilter = document.getElementById("statusFilter").value;
    const applications = this.applications[jobId] || [];

    const filteredApplications = statusFilter
      ? applications.filter((app) => app.status === statusFilter)
      : applications;

    document.getElementById("applicationsList").innerHTML =
      this.renderApplicationsList(filteredApplications);
  }

  updateApplicationStatus(applicationId, newStatus) {
    for (let jobId in this.applications) {
      const app = this.applications[jobId].find((a) => a.id === applicationId);
      if (app) {
        app.status = newStatus;
        this.showToast(Application status updated to ${newStatus});
        break;
      }
    }
  }

  viewCandidateProfile(candidateId) {
    const candidate = this.candidateProfiles[candidateId];
    if (!candidate) return;

    const modalContent = document.getElementById("candidateModalContent");
    modalContent.innerHTML = `
        <h2>Candidate Profile</h2>
        <div class="candidate-profile">
            <div class="profile-section">
                <h3>Personal Information</h3>
                <p><strong>Name:</strong> ${candidate.name}</p>
                <p><strong>Email:</strong> ${candidate.email}</p>
                <p><strong>Phone:</strong> ${candidate.phone}</p>
                <p><strong>Location:</strong> ${candidate.location}</p>
            </div>
            
            <div class="profile-section">
                <h3>Professional Information</h3>
                <p><strong>Experience:</strong> ${candidate.experience}</p>
                <p><strong>Education:</strong> ${candidate.education}</p>
            </div>
            
            <div class="profile-section">
                <h3>Skills</h3>
                <div class="skills-tags">
                    ${candidate.skills
                      .map((skill) => <span class="skill-tag">${skill}</span>)
                      .join("")}
                </div>
            </div>
            
            <div class="profile-section">
                <h3>Resume</h3>
                <button class="btn btn-primary">${candidate.resume}</button>
            </div>
        </div>
    `;

    document.getElementById("candidateModal").style.display = "block";
  }

  addCandidateNote(applicationId) {
    const note = prompt("Add a note about this candidate:");
    if (note) {
      for (let jobId in this.applications) {
        const app = this.applications[jobId].find(
          (a) => a.id === applicationId
        );
        if (app) {
          app.notes = note;
          this.showToast("Note added successfully");
          break;
        }
      }
    }
  }

  handleJobSubmit() {
    const requirementsText = document.getElementById("jobRequirements").value;
    const benefitsText = document.getElementById("jobBenefits").value;

    const formData = {
      title: document.getElementById("jobTitle").value,
      company: document.getElementById("companyName").value,
      location: document.getElementById("jobLocation").value,
      salary: document.getElementById("jobSalary").value,
      type: document.getElementById("jobType").value,
      status: document.getElementById("jobStatus").value,
      experience: document.getElementById("experienceLevel").value,
      description: document.getElementById("jobDescription").value,
      requirements: requirementsText
        ? requirementsText.split("\n").filter((req) => req.trim())
        : [],
      benefits: benefitsText
        ? benefitsText.split("\n").filter((benefit) => benefit.trim())
        : [],
      companySize: document.getElementById("companySize").value,
      industry: document.getElementById("industry").value,
    };

    if (this.editingJobId) {
      const jobIndex = this.jobs.findIndex(
        (job) => job.id === this.editingJobId
      );
      if (jobIndex !== -1) {
        this.jobs[jobIndex] = {
          ...this.jobs[jobIndex],
          ...formData,
        };
        this.showToast("Job updated successfully!");
      }
    } else {
      const newJob = {
        id: Date.now(),
        ...formData,
        posted: new Date().toISOString(),
        isCustom: true,
        views: 0,
        applicationCount: 0,
      };
      this.jobs.unshift(newJob);

      this.applications[newJob.id] = [];

      this.showToast("Job posted successfully!");
    }

    this.resetJobForm();
    this.filterJobs();
  }

  editJob(jobId) {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) return;

    this.editingJobId = jobId;

    document.getElementById("jobTitle").value = job.title;
    document.getElementById("companyName").value = job.company;
    document.getElementById("jobLocation").value = job.location;
    document.getElementById("jobSalary").value = job.salary;
    document.getElementById("jobType").value = job.type;
    document.getElementById("jobStatus").value = job.status || "Active";
    document.getElementById("experienceLevel").value = job.experience;
    document.getElementById("jobDescription").value = job.description;
    document.getElementById("jobRequirements").value = Array.isArray(
      job.requirements
    )
      ? job.requirements.join("\n")
      : "";
    document.getElementById("jobBenefits").value = Array.isArray(job.benefits)
      ? job.benefits.join("\n")
      : "";
    document.getElementById("companySize").value = job.companySize;
    document.getElementById("industry").value = job.industry;

    document.getElementById("formTitle").textContent = "Edit Job";
    document.getElementById("submitJobBtn").textContent = "Update Job";

    document
      .getElementById("adminPanel")
      .scrollIntoView({ behavior: "smooth" });
  }

  deleteJob(jobId) {
    if (confirm("Are you sure you want to delete this job?")) {
      this.jobs = this.jobs.filter((job) => job.id !== jobId);
      this.filterJobs();
      this.showToast("Job deleted successfully!");
    }
  }

  resetJobForm() {
    document.getElementById("jobForm").reset();
    this.editingJobId = null;

    document.getElementById("formTitle").textContent = "Add New Job";
    document.getElementById("submitJobBtn").textContent = "Add Job";
  }

  showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast show";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}

// Initialize the job portal
let jobPortal;
console.log("Script loaded, document.readyState:", document.readyState);

// Simple and reliable initialization for CodeSandbox
function initJobPortal() {
  console.log("Initializing JobPortal...");
  try {
    jobPortal = new JobPortal();
    // Ensure jobPortal is globally accessible for onclick handlers
    window.jobPortal = jobPortal;
    console.log("JobPortal successfully attached to window object");
  } catch (error) {
    console.error("Failed to initialize JobPortal:", error);
    // Retry after a short delay
    setTimeout(() => {
      console.log("Retrying JobPortal initialization...");
      try {
        jobPortal = new JobPortal();
        window.jobPortal = jobPortal;
        console.log("JobPortal successfully attached to window object on retry");
      } catch (retryError) {
        console.error("Second attempt failed:", retryError);
      }
    }, 500);
  }
}

// Multiple initialization strategies for maximum compatibility
if (document.readyState === "loading") {
  console.log("Document still loading, waiting for DOMContentLoaded");
  document.addEventListener("DOMContentLoaded", initJobPortal);
} else if (
  document.readyState === "interactive" ||
  document.readyState === "complete"
) {
  console.log("Document already loaded, initializing immediately");
  // Small delay to ensure all elements are ready
  setTimeout(initJobPortal, 50);
} else {
  console.log("Fallback initialization");
  // Fallback with longer delay
  setTimeout(initJobPortal, 200);
}

// Additional safety net for CodeSandbox
window.addEventListener("load", () => {
  console.log("Window load event fired");
  if (!jobPortal) {
    console.log("JobPortal not initialized yet, trying again");
    initJobPortal();
  } else if (!window.jobPortal) {
    console.log("JobPortal not attached to window, attaching now");
    window.jobPortal = jobPortal;
  }
});

// Debug function for CodeSandbox
window.debugJobPortal = function () {
  console.log("=== DEBUG INFO ===");
  console.log("JobPortal instance:", jobPortal);
  console.log("Window JobPortal:", window.jobPortal);
  console.log("Document ready state:", document.readyState);
  console.log("Jobs array:", jobPortal ? jobPortal.jobs : "No jobPortal");
  console.log(
    "Filtered jobs:",
    jobPortal ? jobPortal.filteredJobs : "No jobPortal"
  );

  if (!jobPortal) {
    console.log("Creating JobPortal instance manually...");
    initJobPortal();
  } else if (!window.jobPortal) {
    console.log("Attaching jobPortal to window...");
    window.jobPortal = jobPortal;
  } else if (jobPortal.jobs.length === 0) {
    console.log("No jobs loaded, trying to load sample data...");
    jobPortal.loadSampleJobs();
    jobPortal.renderJobs();
    jobPortal.updateJobsCount();
  } else {
    console.log("Jobs are loaded, re-rendering...");
    jobPortal.renderJobs();
  }

  console.log("=== END DEBUG ===");
};
