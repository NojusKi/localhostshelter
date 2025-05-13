import React from 'react';
import { Link } from 'react-router-dom';

function Footer(){
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <h3 className='text-x1 font-bold mb-4'>Little Paws Shelter</h3>
                        <p>Giving pets a second chance at life </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/adopt" className="hover:text-red-500">Adopt</Link></li>
                            <li><Link to="/donate" className="hover:text-red-500">Donate</Link></li>
                            <li><Link to="/about" className="hover:text-red-500">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-red-500">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Hours</h3>
                        <p>
                            Monday - Saturday: 10:00  - 18:00 <br />
                            Sunday: Closed
                        </p>
                    </div>
                    </div>
                    <div className="mt-8 border-t border-gray-700 pt-8">
                        <p>&copy;2025 Shelter by Nojus Kisieliauskas.</p>
                    </div>
                </div>

        </footer>
    );
}

export default Footer;
