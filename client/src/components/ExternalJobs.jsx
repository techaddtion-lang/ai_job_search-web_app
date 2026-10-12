import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'

const ExternalJobs = () => {
    const { searchedQuery } = useSelector(store => store.job);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isCurrent = true;
        const fetchExternalJobs = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get('http://localhost:8000/api/v1/job/external', {
                    params: { what: searchedQuery || '', where: 'India' }
                });
                if (isCurrent) setJobs(response.data.jobs);
            } catch (requestError) {
                if (isCurrent) {
                    setError(requestError.response?.data?.message || 'Unable to load external jobs. Please try again later.');
                }
            } finally {
                if (isCurrent) setLoading(false);
            }
        };

        fetchExternalJobs();
        return () => {
            isCurrent = false;
        };
    }, [searchedQuery]);

    return (
        <section className='max-w-7xl mx-auto my-10'>
            <h2 className='text-3xl font-bold'>External Jobs in India</h2>
            <p className='text-sm text-gray-600 mt-1'>Listings from Adzuna. Apply on the employer&apos;s website.</p>
            {loading ? <p className='my-5'>Loading external jobs...</p> : null}
            {!loading && error ? <p role='alert' className='my-5 text-red-700'>{error}</p> : null}
            {!loading && !error && jobs.length === 0 ? <p className='my-5'>No external jobs found for this search.</p> : null}
            {!loading && !error && jobs.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-5'>
                    {jobs.map((job) => (
                        <article key={job.id} className='p-5 rounded-md shadow bg-white border border-gray-100'>
                            <h3 className='font-bold text-lg'>{job.title}</h3>
                            <p className='font-medium mt-1'>{job.company}</p>
                            <p className='text-sm text-gray-600'>{job.location}</p>
                            <p className='text-sm text-gray-700 my-3'>{job.description.slice(0, 220)}{job.description.length > 220 ? '…' : ''}</p>
                            <p className='text-xs text-gray-600'>
                                {[job.contractType, job.contractTime].filter(Boolean).join(' · ')}
                                {job.salaryMin || job.salaryMax ? ` · ${job.salaryMin || ''}${job.salaryMin && job.salaryMax ? '–' : ''}${job.salaryMax || ''}` : ''}
                            </p>
                            <a
                                href={job.url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded'
                            >
                                View and apply
                            </a>
                        </article>
                    ))}
                </div>
            ) : null}
        </section>
    );
};

export default ExternalJobs;
