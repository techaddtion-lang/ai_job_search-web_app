import { useSelector } from "react-redux";
import { CheckCircle2 } from "lucide-react";
import Job from "./Job";

const Recommended = () => {
    const { allJobs } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);

    // Extract user skills
    const userSkills = user?.profile?.skills || [];

    // Filter jobs based on matching skills
    const recommendedJobs = (allJobs || [])
        .map(job => ({
            job,
            matchingSkills: job.requirements?.filter(req => userSkills.includes(req)).length || 0,
        }))
        .filter(recommendation => recommendation.matchingSkills > 0)
        .sort((first, second) => second.matchingSkills - first.matchingSkills);

    return user ? (
        <div className='pb-5 pr-4'>
            <h1 className='text-4xl font-bold mb-5' >Recommended Jobs</h1>
            <div className='grid grid-cols-3 gap-4'>
                {recommendedJobs.length > 0 ? (
                    recommendedJobs.map(({ job }, index) => (
                        <div key={job._id} className='relative'>
                            {index === 0 && (
                                <span className='absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700'>
                                    <CheckCircle2 className='h-4 w-4' aria-hidden='true' />
                                    Daily Highlight
                                </span>
                            )}
                            <Job job={job} />
                        </div>
                    ))
                ) : (
                    <p>No Recommended Jobs Found</p>
                )}
            </div>
        </div>
    ) : null;
    
};

export default Recommended;
