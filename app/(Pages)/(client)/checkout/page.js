"use client"
import React from 'react'

export default function page() {
    const handlechangeinp = () => {
        console.log("hello");
    }
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            <div className="relative flex h-auto min-h-screen w-full flex-col font-display">
                <div className="layout-container flex h-full grow flex-col">

                    <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 md:px-20 py-4 sticky top-0 z-50">
                        <div className="flex items-center gap-3">
                            <div className="text-primary size-8">
                                <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"></path>
                                </svg>
                            </div>
                            <h2 className="text-slate-900 dark:text-white text-xl font-extrabold tracking-tight">Organic Market</h2>
                        </div>
                        <div className="flex items-center gap-8">
                            <nav className="hidden md:flex items-center gap-8">
                                <a className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors" href="#">Shop</a>
                                <a className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors" href="#">Vendors</a>
                                <a className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors" href="#">Sustainability</a>
                            </nav>
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-2 border-primary overflow-hidden">
                                <img className="w-full h-full object-cover" data-alt="User profile avatar portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVY2tXXAuIgrcmlm4cB28k3V0iVM4ZEwv1MxUrT-fSg8pugiRLcTqNTTZT9S8Ic_OtHm2G_an34oSbX6mS1folpIRP1brqOTH8yYwa-oVXWzCJzZFJZbiC2DmuM66ypRWr-FrgMCYbyhXcnMYNKbtMj0oYnflTOdxLr1yAS9rOXpn_EU5FRKLSTM0zFvSnehay8YFBN8O9N8JUdt4RfDIjXMcLOcnJEshnr6J9vuHXXWUB8kj3Yo9y3DU0UtEIzF04DUph8XX9_NBM" />
                            </div>
                        </div>
                    </header>
                    <main className="max-w-[1200px] mx-auto w-full px-6 py-8">

                        <nav className="flex items-center gap-2 mb-8 text-sm font-medium">
                            <a className="text-slate-500 hover:text-primary transition-colors" href="#">Cart</a>
                            <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
                            <span className="text-slate-900 dark:text-white">Checkout</span>
                        </nav>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                            <div className="lg:col-span-8 space-y-10">

                                <section>
                                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Checkout</h1>
                                    <p className="text-slate-500 dark:text-slate-400">Please provide your details to complete your eco-friendly purchase.</p>
                                </section>

                                <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className="material-symbols-outlined text-primary">person</span>
                                        <h3 className="text-xl font-bold">Customer Information</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="col-span-1 md:col-span-2">
                                            <label className="block text-sm font-semibold mb-2">Full Name</label>
                                            <input className="form-input w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3" placeholder="Jane Doe" type="text" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2">Email Address</label>
                                            <input className="form-input w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3" placeholder="jane@example.com" type="email" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2">Phone Number</label>
                                            <input className="form-input w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3" placeholder="+1 (555) 000-0000" type="tel" />
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className="material-symbols-outlined text-primary">local_shipping</span>
                                        <h3 className="text-xl font-bold">Shipping Address</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="col-span-1 md:col-span-2">
                                            <label className="block text-sm font-semibold mb-2">Street Address</label>
                                            <input className="form-input w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3" placeholder="123 Eco Street, Apt 4" type="text" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2">City</label>
                                            <input className="form-input w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3" placeholder="San Francisco" type="text" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2">Postal Code</label>
                                            <input className="form-input w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3" placeholder="94103" type="text" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2">Country</label>
                                            <select className="form-input w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3">
                                                <option>United States</option>
                                                <option>Canada</option>
                                                <option>United Kingdom</option>
                                            </select>
                                        </div>
                                        <div className="col-span-1 md:col-span-2">
                                            <label className="block text-sm font-semibold mb-2">Delivery Notes (Optional)</label>
                                            <textarea className="form-input w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3" placeholder="Leave at the front door please..." rows="3"></textarea>
                                        </div>
                                        <div className="col-span-1 md:col-span-2 flex items-center gap-2">
                                            <input className="rounded text-primary focus:ring-primary border-slate-300" id="save-address" type="checkbox" />
                                            <label className="text-sm text-slate-600 dark:text-slate-400">Save this address for future purchases</label>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className="material-symbols-outlined text-primary">schedule</span>
                                        <h3 className="text-xl font-bold">Delivery Options</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        <label className="relative flex flex-col p-5 cursor-pointer rounded-xl border-2 border-primary bg-primary/5 transition-all">
                                            <input onChange={() => { handlechangeinp(); }} className="absolute top-4 right-4 text-primary focus:ring-primary h-4 w-4" name="delivery" type="radio" value="standard" />
                                            <span className="text-sm font-bold text-primary uppercase tracking-wider mb-1">Standard Shipping</span>
                                            <span className="text-xl font-extrabold mb-1">$5.00</span>
                                            <span className="text-sm text-slate-500">Estimated: Oct 12 - Oct 14</span>
                                        </label>

                                        <label className="relative flex flex-col p-5 cursor-pointer rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:border-primary/50">
                                            <input className="absolute top-4 right-4 text-primary focus:ring-primary h-4 w-4" name="delivery" type="radio" value="express" />
                                            <span className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Express Delivery</span>
                                            <span className="text-xl font-extrabold mb-1">$12.50</span>
                                            <span className="text-sm text-slate-500">Estimated: Oct 10 - Oct 11</span>
                                        </label>
                                    </div>
                                </section>

                                <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className="material-symbols-outlined text-primary">payments</span>
                                        <h3 className="text-xl font-bold">Payment Method</h3>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 mb-8">
                                        <button className="flex flex-col items-center justify-center p-4 border rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-primary transition-colors" type="button">
                                            <span className="material-symbols-outlined mb-2 text-slate-400">payments</span>
                                            <span className="text-xs font-bold uppercase tracking-tight">Cash</span>
                                        </button>
                                        <button className="flex flex-col items-center justify-center p-4 border-2 rounded-xl border-primary bg-primary/5" type="button">
                                            <span className="material-symbols-outlined mb-2 text-primary">credit_card</span>
                                            <span className="text-xs font-bold uppercase tracking-tight">Card</span>
                                        </button>
                                        <button className="flex flex-col items-center justify-center p-4 border rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-primary transition-colors" type="button">
                                            <span className="material-symbols-outlined mb-2 text-slate-400">contactless</span>
                                            <span className="text-xs font-bold uppercase tracking-tight">Mobile</span>
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2">Card Number</label>
                                            <div className="relative">
                                                <input className="form-input w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3 pr-12" placeholder="0000 0000 0000 0000" type="text" />
                                                <span className="material-symbols-outlined absolute right-3 top-3 text-slate-400">credit_card</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2">Cardholder Name</label>
                                            <input className="form-input w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3" placeholder="JANE DOE" type="text" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold mb-2">Expiry Date</label>
                                                <input className="form-input w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3" placeholder="MM / YY" type="text" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold mb-2">CVV</label>
                                                <input className="form-input w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3" placeholder="123" type="text" />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="lg:col-span-4">
                                <div className="sticky top-28 space-y-6">
                                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
                                        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                            <h3 className="text-xl font-bold">Order Summary</h3>
                                        </div>
                                        <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">

                                            <div className="flex gap-4">
                                                <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                                                    <img className="w-full h-full object-cover" data-alt="Fresh organic green vegetable crate" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0VadFnepsIv_rQv8o--VJ8dgRSfsR4B26XtBoMTrsCkomRNwTNfIn-ivaMsCzvAob8Awi89JNWZ5JH9j4nhj94-IvRCoiG8vvxSmDgRFFzq0Kmi6XsyHL3__hKoVu-ULvS9CjuOnO8kDMXwgRVHdyCQ-ktRZI-Ele5k1ynH3wnny0cCj9vxqiTxnxRCaIhMs7j8Q2dQf2UgT74i7QDhKjmU6y_S3yLR7tHwFkUJLUP4otc3PwclG7Gfzf4JDw4nAYVATnkKwadw6c" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">Organic Spinach Mix</h4>
                                                    <p className="text-xs text-slate-500 mb-1">Qty: 2</p>
                                                    <p className="text-sm font-extrabold text-primary">$12.00</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                                                    <img className="w-full h-full object-cover" data-alt="Fresh organic bright oranges" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSUv63PeZgVhF69pLReew6oVgoqIua4Mh_X0B2269Do3bdY9Ji4TONyoecJcUh6hlrDqOQMCc5ZTzftpOGUavLXnYvRXxO8mHcLPkJHp9FWvcYAgDMLccLWbqnwN9VvMSFqz3anFUfqM0Ki8gQAz3UVHDIdgUKUF5rOxqAEmhCYnZ1vN7g0N4YxZWaRrYrb5XZx42jVVq33Bzl8k12woxQG9DufF_QAPaw2Pqpaiez0AGvz4_Kwkmuwt4yC8VARgbCGB1Y1B9rsyo3" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">Valencia Oranges (3lb)</h4>
                                                    <p className="text-xs text-slate-500 mb-1">Qty: 1</p>
                                                    <p className="text-sm font-extrabold text-primary">$8.50</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                                                    <img className="w-full h-full object-cover" data-alt="Fresh organic orange carrots" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAayrag6uN_ZtBD2XkznKMoFI52RdA0ZGx3lehCU0auU4LHXZ77jH2ylct-Ge0o768UEiXXsQNryrXsYnZWRqPddjSX1-fGkQqokQrQOHNeHCA5Ikxav-lA4qL1GdJlrR5f6i-nnP9zPyeR58Iq5QGDTqiOUbsIqNMWKO4ol2gs7LQWhvOZhRjV-sVHQI7SdFdqlSgSb0T4VYE4nsL_9uRe0Fiw2ZNW_ZVPv2EfHibsL7HD3rG4UfsQCuENY4RH1Oe-qMsBxuhT6h-M" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">Baby Carrots Bunch</h4>
                                                    <p className="text-xs text-slate-500 mb-1">Qty: 3</p>
                                                    <p className="text-sm font-extrabold text-primary">$6.75</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 space-y-3">
                                            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                                <span>Subtotal</span>
                                                <span className="font-semibold">$27.25</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                                <span>Delivery Fee</span>
                                                <span className="font-semibold">$5.00</span>
                                            </div>
                                            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-end">
                                                <span className="text-lg font-bold">Total</span>
                                                <span className="text-2xl font-extrabold text-primary">$32.25</span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <button className="w-full bg-primary hover:bg-opacity-90 text-slate-900 font-extrabold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
                                                Place Your Order
                                                <span className="material-symbols-outlined">arrow_forward</span>
                                            </button>
                                            <p className="text-[10px] text-center text-slate-400 mt-4 leading-tight uppercase tracking-widest font-bold">
                                                Eco-Friendly Packaging Guaranteed
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 px-2 leading-relaxed text-center">
                                        By placing your order, you agree to our <a className="underline text-primary" href="#">Terms of Service</a> and <a className="underline text-primary" href="#">Sustainability Commitment</a>. Your payment data is secured with bank-grade encryption.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </main>

                    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 py-12 px-6 bg-white dark:bg-slate-950">
                        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                            <div>
                                <h4 className="font-extrabold text-slate-900 dark:text-white mb-4">Organic Market</h4>
                                <p className="text-sm text-slate-500 max-w-xs mx-auto md:mx-0">Empowering local farmers and sustainable eating since 2021. Join our green revolution.</p>
                            </div>
                            <div>
                                <h4 className="font-extrabold text-slate-900 dark:text-white mb-4">Quick Links</h4>
                                <ul className="text-sm text-slate-500 space-y-2">
                                    <li><a className="hover:text-primary" href="#">Shipping Policy</a></li>
                                    <li><a className="hover:text-primary" href="#">Return Guidelines</a></li>
                                    <li><a className="hover:text-primary" href="#">Support Center</a></li>
                                </ul>
                            </div>
                            <div className="flex flex-col items-center md:items-end">
                                <div className="flex gap-4 mb-4">
                                    <span className="material-symbols-outlined p-2 rounded-full bg-primary/10 text-primary">eco</span>
                                    <span className="material-symbols-outlined p-2 rounded-full bg-primary/10 text-primary">compost</span>
                                    <span className="material-symbols-outlined p-2 rounded-full bg-primary/10 text-primary">recycling</span>
                                </div>
                                <p className="text-xs text-slate-400">© 2024 Organic Market. Carbon Neutral.</p>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    )
}