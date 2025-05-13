import {useEffect, useState} from 'react';

//interface for the event
interface Event{
    title: string;
    date: string;
}

//component for displaying upcoming events
export const UpcomingEvents = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [ error, setError] = useState<string | null>(null);

    //fetching events from the json file
    useEffect(() =>{
        fetch('/api/events.json')
        .then(response => {
            if (!response.ok) { //if the response is not ok
                throw new Error('failed to fetch events');
            }
            return response.json();//parsing the response as json
        })
        .then(data =>{
            setEvents(data); //setting the events to the state
        })
        .catch(error => {       //catching the error
            console.error('Error loading events:', error);
            setError('Failed to load the events');
        });
    }, []);

    console.log('Events:', events, 'Error:', error);//logging the events and error

    if (error) {
        return <div className='text-red-500'>{error}</div>;//
    }

    return(
        <section className='py-8 px-4'>
            <h2 className='text-2xl font-bold mb-4'>Upcoming events</h2>
            <ul className='space-y-2'>
                {/*mapping through the events and displaying them*/}
                {events.map((event,index) => (
                    <li key={index} className='bg-white rounded-lg shadow-md p-6 mb-4'>
                        <span className='font-semibold'>{event.title}</span>
                        <span className='text-gray-600'>-</span>
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                    </li>
                ))}
            </ul>
        </section>
    )
}