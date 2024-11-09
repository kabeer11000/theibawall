import React, { useState } from 'react';
import { auth } from '../../firebaseconfig'; // Import your firebase configuration
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Onboard() {
    const [photo, setPhoto] = useState(null);
    const [userId, setUserId] = useState(null);
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handlePhotoUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            alert('Please select a file.');
            return;
        }
        setPhoto(file);

        // Simulate generating a random ID
        const randomId = Math.random().toString(36).substring(2, 15);
        setUserId(randomId);

        // Move to the next step
        setStep(2);
    };

    const handleNextStep = () => {
        if (step < 3) {
            setStep(step + 1);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setEmail('');
            setPassword('');
            // Move to the next step after successful login
            setStep(1);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
                <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                    <li className={`flex-1 ${step === 1 ? 'text-blue-600' : ''}`}>
                        <span className="flex items-center">
                            <span className="me-2">1</span>
                            Personal Info
                        </span>
                    </li>
                    <li className={`flex-1 ${step === 2 ? 'text-blue-600' : ''}`}>
                        <span className="flex items-center">
                            <span className="me-2">2</span>
                            Account Info
                        </span>
                    </li>
                    <li className={`flex-1 ${step === 3 ? 'text-blue-600' : ''}`}>
                        <span className="flex items-center">
                            <span className="me-2">3</span>
                            Confirmation
                        </span>
                    </li>
                </ol>

                {step === 1 && (
                    <div className="mt-6">
                        <input
                            type="file"
                            onChange={handlePhotoUpload}
                            className="border border-gray-300 p-2 mb-4 w-full"
                        />
                        <button
                            onClick={handleNextStep}
                            disabled={!photo}
                            className={`w-full p-2 text-white rounded ${!photo ? 'bg-gray-400' : 'bg-blue-500'}`}
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="mt-6">
                        <p>Your photo will be displayed on the wall for 20 hours.</p>
                        <p>Your ID: {userId}</p>
                        <p>Please send your proof of payment to our Instagram account.</p>
                        <form onSubmit={handleLogin} className="mt-4">
                            {error && <p className="text-red-500">{error}</p>}
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border border-gray-300 p-2 mb-4 w-full"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border border-gray-300 p-2 mb-4 w-full"
                                required
                            />
                            <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded">
                                Sign In
                            </button>
                        </form>
                        <button onClick={handleNextStep} className="mt-4 w-full p-2 text-white bg-gray- 400 rounded">
                            Next
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="mt-6 text-center">
                        <h2 className="text-xl font-semibold">Thank You!</h2>
                        <p>Your onboarding is complete.</p>
                        <p>Your ID: {userId}</p>
                    </div>
                )}
            </div>
        </div>
    );
}