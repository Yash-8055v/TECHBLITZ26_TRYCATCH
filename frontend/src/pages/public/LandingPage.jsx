import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <div className="layout-container flex h-full grow flex-col">
                {/* Header */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 md:px-20 py-4 bg-white dark:bg-background-dark sticky top-0 z-50">
                    <div className="flex items-center gap-4">
                        <div className="size-10 flex items-center justify-center bg-primary rounded-lg text-white">
                            <span className="material-symbols-outlined text-2xl">clinical_notes</span>
                        </div>
                        <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">ClinicFlow</h2>
                    </div>
                    <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
                        <nav className="flex items-center gap-8">
                            <a className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">Features</a>
                            <a className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">Solutions</a>
                            <a className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">Pricing</a>
                            <a className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">About</a>
                        </nav>
                        <button 
                            onClick={() => navigate('/login')}
                            className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                        >
                            Get Started
                        </button>
                    </div>
                    <div className="md:hidden">
                        <span className="material-symbols-outlined text-slate-900 dark:text-white">menu</span>
                    </div>
                </header>

                <main className="flex-1">
                    {/* Hero Section */}
                    <section className="px-6 md:px-20 py-12 md:py-20 max-w-7xl mx-auto">
                        <div className="flex flex-col gap-10 lg:flex-row items-center">
                            <div className="flex flex-col gap-8 lg:w-1/2">
                                <div className="flex flex-col gap-4">
                                    <span className="text-primary font-bold tracking-widest text-xs uppercase bg-primary/10 w-fit px-3 py-1 rounded-full">Healthcare Evolution</span>
                                    <h1 className="text-slate-900 dark:text-white text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
                                        Run your clinic <span className="text-primary">smarter</span>, not harder
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed max-w-lg">
                                        Replace paper tokens and manual records with our smart clinic operating system. Streamline workflows and enhance patient care with real-time automation.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <button 
                                        onClick={() => navigate('/login')}
                                        className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-primary text-white text-base font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
                                    >
                                        I'm a Clinic
                                    </button>
                                    <button 
                                        onClick={() => navigate('/check-in')}
                                        className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-base font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        I'm a Patient
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 pt-4">
                                    <div className="flex -space-x-3">
                                        <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBRcxxZGGlMg0dDJfHT88rRj_gMCkunQ_q85OFNRNd4LDGdrrIWkZSPo9KgoPhvp5Jg6nQ9OAouWL2NAjdJ6oWKNBlUBGhr_31Sztf-FhVHVWERn1opvh3aKjrR3226WRrM5rMAf843ReB8cfS4sKEX3_qCtQhPmE0BaY1AlAyBphJiU_IawjdFj6TPKSaP8D4-9KA7IplS34ivRC_VlteZG-BNoNkP9zluYY5CSbQaNJVLkKfPruKR6cv-prpkjTYo5KnR3VeuVP4')" }}></div>
                                        <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBMec1vqn_IL1y0_oiu0A8VhtCR8oZkSjBZQfNM4sX7T-GK79XDz7cyXlttHa4CUdojZvdshqr7v-d0nTfw9qB_LJ1CIj7ZE4jCKN7ISyqJzJz0-QP1DTVeT6ibJLQFYJXGNnjfbxxccfK1CZH6_BVQJRZrP_Bd4BKD5KS_6_Z1mc715TuWyBdZY3A7TRCDU_am5qFEHMu9btcoysb4HDgn8CRCOW82OfEjwy9oKeJGrXWUJj9CNCuu4vuytqqiq4UlTFi6vNxt818')" }}></div>
                                        <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCqT22F-VeDQ8V8z0CnPBhiHHoUDUg2VEyT71NiH8wcD-eW72v8Fm3HyZzmHzD-EBxvTPd06wbh4s-g5HnefyKAIjjxuwlgt9YODsTX4--6VTTik61kWtyPBQug6ujFQgwqzLo8ZIl3WxFxm_EtcJFCvwLBjy45STILQsb5oJ4ta6CqAQuWsp68t2-8fj3pdobc7ZTTHsfONkxOziADoL44HxOatcro99zPWkVrdjSpZlzsINKx9GFlwIP674r1MHLDfyhBd1l6ZTk')" }}></div>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Trusted by 2,000+ medical professionals</p>
                                </div>
                            </div>
                            <div className="lg:w-1/2 w-full">
                                <div className="relative w-full aspect-video md:aspect-square bg-primary/5 rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDWggmWDdahauHxjhp9s-jpTNptkT3O--jP4YLej2QWxmE3ekXmH-iKQd0_Fc0PUDtv3wkKWR1Yh_cPccep-MiskeLWr0ohsdYn_CnKVKnzXTamrc8Vqp68Xx707UVwdGr7B9AuQFNiXceFiJQRIOJ78-zvkiFPYvG7qoo88j9KgKxV6x01sFCPd8ljIt7qw2xk0LWpy9D8bxHqq8lHq4vdUcQbdm6W_5n0aO0fKtVF1kTDHYZ46tFcP8EJ9Qx8dM7JWu3iLXfd_RM')" }}></div>
                                    <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md p-6 rounded-2xl shadow-xl flex items-center justify-between border border-white/20">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Queue</p>
                                                <p className="text-lg font-bold">Currently Serving: #24</p>
                                            </div>
                                        </div>
                                        <div className="text-primary font-bold text-sm">Next: 4 mins</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Partners Section */}
                    <section className="bg-white dark:bg-slate-900/50 py-12 border-y border-slate-200 dark:border-slate-800">
                        <div className="max-w-7xl mx-auto px-6 md:px-20">
                            <div className="flex flex-wrap justify-between items-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all">
                                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-slate-400">health_and_safety</span><span className="font-bold text-xl text-slate-400">MedCore</span></div>
                                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-slate-400">verified</span><span className="font-bold text-xl text-slate-400">HealthCert</span></div>
                                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-slate-400">local_hospital</span><span className="font-bold text-xl text-slate-400">ClinicPlus</span></div>
                                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-slate-400">ecg_heart</span><span className="font-bold text-xl text-slate-400">VitalCare</span></div>
                            </div>
                        </div>
                    </section>

                    {/* Solutions Section */}
                    <section className="px-6 md:px-20 py-24 max-w-7xl mx-auto">
                        <div className="flex flex-col gap-12">
                            <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
                                <h2 className="text-primary font-bold text-sm uppercase tracking-[0.2em]">Our Solutions</h2>
                                <h3 className="text-slate-900 dark:text-white text-3xl md:text-5xl font-extrabold tracking-tight">Everything you need to manage a modern clinic</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="group flex flex-col gap-6 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                                    <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-3xl">schedule</span>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <h4 className="text-xl font-bold">Real-time Queue</h4>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Live queue tracking for patients and staff to reduce waiting room congestion and improve efficiency.</p>
                                    </div>
                                </div>
                                <div className="group flex flex-col gap-6 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                                    <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-3xl">prescriptions</span>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <h4 className="text-xl font-bold">Digital Prescriptions</h4>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Generate and send secure digital prescriptions directly to patients' phones with a single click.</p>
                                    </div>
                                </div>
                                <div className="group flex flex-col gap-6 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                                    <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-3xl">calendar_month</span>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <h4 className="text-xl font-bold">Easy Appointments</h4>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Seamless online booking system that syncs perfectly with your clinic's manual and walk-in schedule.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Testimonials and Stats */}
                    <section className="bg-primary/5 py-24 px-6 md:px-20 overflow-hidden">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex flex-col md:flex-row gap-16 items-center">
                                <div className="w-full md:w-1/2 flex flex-col gap-8">
                                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">What Doctors are Saying</h2>
                                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl relative">
                                        <span className="material-symbols-outlined text-6xl text-primary/10 absolute top-4 right-4">format_quote</span>
                                        <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 italic mb-8 relative z-10 leading-relaxed">
                                            "ClinicFlow has completely transformed how we manage patient flow. The digital tokens have reduced patient frustration and my staff can focus more on care than on managing the crowd. It's the upgrade every local clinic needs."
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <div className="size-14 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBB7zGyivdHC584CK7J4eFHQorvtWREO7fK34dnngjjPYDui2vSasz0lpPgKahW02kheQsUVTXFvAvfv-LlSmhQ5z4yihFqkPd82PdDTrvixu8f_6_0N3d72-6FB8gbIk9PzMN5kGClI-PZDlxcXkNwF0Jbf4Fb4ED_-2vwe6AiXwGYGdavxyhYGa5DhGq_vLubLr9kzWXZP5icPwcNCLMqNqfKKk7cLGIibNDKEwRzk5jMsmoVw_E69UhcXCercY9PJs5YnUS2mak')" }}></div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">Dr. Sarah Jenkins</p>
                                                <p className="text-sm text-slate-500">Chief Medical Officer, City Care Clinic</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button className="size-12 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                            <span className="material-symbols-outlined">arrow_back</span>
                                        </button>
                                        <button className="size-12 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                            <span className="material-symbols-outlined">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                                        <p className="text-4xl font-extrabold text-primary mb-1">500+</p>
                                        <p className="text-sm font-medium text-slate-500 uppercase">Clinics Joined</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                                        <p className="text-4xl font-extrabold text-primary mb-1">1M+</p>
                                        <p className="text-sm font-medium text-slate-500 uppercase">Patients Served</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                                        <p className="text-4xl font-extrabold text-primary mb-1">10k+</p>
                                        <p className="text-sm font-medium text-slate-500 uppercase">Hours Saved</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                                        <p className="text-4xl font-extrabold text-primary mb-1">98%</p>
                                        <p className="text-sm font-medium text-slate-500 uppercase">Satisfaction</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Banner */}
                    <section className="px-6 md:px-20 py-24 max-w-7xl mx-auto">
                        <div className="bg-primary rounded-[2.5rem] p-10 md:p-20 text-white flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M44.7,-76.4C58.2,-69.2,70.1,-59,78.5,-46.2C86.9,-33.4,91.8,-18,91.3,-2.6C90.7,12.8,84.7,28.2,75.7,41.4C66.7,54.6,54.7,65.6,41,72.9C27.3,80.1,11.8,83.6,-2.4,87.7C-16.6,91.8,-29.4,96.5,-41.7,91.2C-54,85.9,-65.7,70.6,-73.4,55.5C-81.1,40.4,-84.8,25.5,-86.6,10.2C-88.4,-5.1,-88.3,-20.8,-82.1,-34.5C-75.9,-48.2,-63.6,-59.9,-49.9,-67C-36.2,-74.1,-21.1,-76.5,-5.5,-67.1C10.2,-57.6,44.7,-76.4,44.7,-76.4Z" fill="#FFFFFF" transform="translate(100 100)"></path>
                                </svg>
                            </div>
                            <div className="flex flex-col gap-6 md:w-2/3 relative z-10">
                                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Ready to modernize your practice?</h2>
                                <p className="text-primary-foreground/80 text-lg md:text-xl max-w-lg">
                                    Join hundreds of clinics already saving time and improving patient experiences with ClinicFlow.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto relative z-10">
                                <button className="bg-white text-primary px-8 h-14 rounded-xl font-bold text-lg hover:bg-slate-100 transition-colors shadow-xl">
                                    Get Started Free
                                </button>
                                <button className="bg-primary/20 backdrop-blur-sm text-white border border-white/30 px-8 h-14 rounded-xl font-bold text-lg hover:bg-primary/30 transition-colors">
                                    Schedule Demo
                                </button>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="bg-slate-900 text-white px-6 md:px-20 py-20">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-3">
                                <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-white">
                                    <span className="material-symbols-outlined text-xl">clinical_notes</span>
                                </div>
                                <h2 className="text-xl font-bold">ClinicFlow</h2>
                            </div>
                            <p className="text-slate-400 leading-relaxed">
                                The comprehensive operating system for modern medical practices and patient-first care.
                            </p>
                            <div className="flex gap-4">
                                <a className="size-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors" href="#">
                                    <span className="material-symbols-outlined text-sm">public</span>
                                </a>
                                <a className="size-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors" href="#">
                                    <span className="material-symbols-outlined text-sm">share</span>
                                </a>
                                <a className="size-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors" href="#">
                                    <span className="material-symbols-outlined text-sm">mail</span>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-6">Product</h4>
                            <ul className="flex flex-col gap-4 text-slate-400">
                                <li><a className="hover:text-primary transition-colors" href="#">Queue System</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Appointments</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">E-Prescription</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Billing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-6">Company</h4>
                            <ul className="flex flex-col gap-4 text-slate-400">
                                <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Blog</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-6">Legal</h4>
                            <ul className="flex flex-col gap-4 text-slate-400">
                                <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">HIPAA Compliance</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between gap-6 text-slate-500 text-sm">
                        <p>© 2024 ClinicFlow Inc. All rights reserved.</p>
                        <div className="flex gap-8">
                            <a className="hover:text-white transition-colors" href="#">Help Center</a>
                            <a className="hover:text-white transition-colors" href="#">Status</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;
