import React, { useState} from 'react';
import { Lightbulb} from 'lucide-react';

//component for displaying a random pet care tip
const PetCareTip: React.FC = () => {
    const [tip, setTip] = useState<string | null>(null); //state for the tip
    const [isLoading, setIsLoading] = useState(false); //state for the loading
    const [error, setError] = useState<string | null>(null);
    
    const fetchRandomTip = async () => {
        setIsLoading(true);
        setError(null);
        try{
            const response = await fetch('/api/pet-tips.json'); //fetching the tip from the json file
            if (!response.ok){
                throw new Error('Failed to fecth the tip'); //if the response is not ok
            }

            const data = await response.json(); //parsing the response as json
            const randomIndex = Math.floor(Math.random() * data.tips.length); //generating a random index
            setTip(data.tips[randomIndex].tip); //setting the tip to the state
        } catch (err) {
            setError('Failed to load the tip. Try later');
            console.error('Error fetching tip:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <div className='bg-white rounded-lg shadow-md p-6 w-full max-w-xl mx-auto'>
            <div className='flex items-center gap-3 mb-12'>
                <Lightbulb className="h-8 w-8 text-red-500"/>
                <h2 className="text-x1 font-semibold">Pet Care Tips Of The Day</h2>
            </div>

            <div className='min-h-[100px] flex flex-col'>
                {tip &&(
                    <p className='text-gray-700 mb-4 flex-grow'>
                        {tip}
                    </p>
                )}
                {error &&(
                    <p className="text-red-500=mb-4">
                        {error}
                    </p>
                )}

                <button //button for fetching a random tip
                    onClick={fetchRandomTip} //fetching a random tip
                    disabled={isLoading} //disabling the button if the tip is loading
                    className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 disabled.opacity-50 disabled:cursor-not-allowed'>
                        {isLoading ? 'loading...' : tip ? 'Get A New Tip' : 'Get A Tip'} 
                    </button>
            </div>
        </div>
    );
};

export default PetCareTip;