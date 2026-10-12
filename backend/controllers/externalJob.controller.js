const ADZUNA_API_BASE_URL = "https://api.adzuna.com/v1/api/jobs";

export const getExternalJobs = async (req, res) => {
    const { ADZUNA_APP_ID, ADZUNA_APP_KEY } = process.env;
    if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
        return res.status(503).json({
            success: false,
            message: "External job search is not configured. Add ADZUNA_APP_ID and ADZUNA_APP_KEY to backend/.env."
        });
    }

    const country = (process.env.ADZUNA_COUNTRY || "in").toLowerCase();
    if (!/^[a-z]{2}$/.test(country)) {
        return res.status(500).json({
            success: false,
            message: "ADZUNA_COUNTRY must be a two-letter country code."
        });
    }

    const what = String(req.query.what || "").trim().slice(0, 100);
    const where = String(req.query.where || "India").trim().slice(0, 100);
    const url = new URL(`${ADZUNA_API_BASE_URL}/${country}/search/1`);
    url.search = new URLSearchParams({
        app_id: ADZUNA_APP_ID,
        app_key: ADZUNA_APP_KEY,
        results_per_page: "20",
        what,
        where,
        "content-type": "application/json"
    }).toString();

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Adzuna job search returned HTTP ${response.status}.`);
            return res.status(502).json({
                success: false,
                message: "The external job service is unavailable. Please try again later."
            });
        }

        const data = await response.json();
        const jobs = (data.results || []).map((job) => ({
            id: job.id,
            title: job.title,
            company: job.company?.display_name || "Company not specified",
            location: job.location?.display_name || "Location not specified",
            description: job.description || "",
            url: job.redirect_url,
            created: job.created,
            salaryMin: job.salary_min,
            salaryMax: job.salary_max,
            contractType: job.contract_type,
            contractTime: job.contract_time
        }));

        return res.status(200).json({ success: true, jobs });
    } catch (error) {
        console.error("Unable to retrieve external jobs:", error);
        return res.status(502).json({
            success: false,
            message: "Unable to reach the external job service. Please try again later."
        });
    }
};
