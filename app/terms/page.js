import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col pt-24 px-6 pb-12">
      
      {/* Back Button */}
      <div className="max-w-4xl mx-auto w-full mb-8">
        <Link href="/" className="text-cyan-500 hover:text-cyan-400 text-sm font-medium transition-colors">
          &larr; Back to Home
        </Link>
      </div>

      <main className="max-w-4xl mx-auto w-full flex-grow text-slate-300">
        <h1 className="text-3xl font-bold text-white mb-8 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] border-b border-slate-800 pb-4">
          JP's Tech Garage LLC - Invoice Terms & Conditions
        </h1>
        
        <p className="mb-8 text-sm text-slate-400 italic">
          These terms and conditions govern the repair services, sales, and billing practices for JP's Tech Garage LLC.
        </p>

        <div className="space-y-10 leading-relaxed">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold text-cyan-400 mb-3 drop-shadow-[0_0_5px_rgba(6,182,212,0.3)]">
              1. Payment & Billing
            </h2>
            <p className="text-sm">
              Payment is due in full upon receipt of this invoice. Devices will not be returned to the customer until full payment has been secured.
            </p>
          </section>
          
          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold text-cyan-400 mb-3 drop-shadow-[0_0_5px_rgba(6,182,212,0.3)]">
              2. Repair Warranty Policy
            </h2>
            <p className="text-sm mb-4">
              We stand behind our work. JP's Tech Garage LLC offers the following limited warranties on parts and labor:
            </p>
            
            <div className="overflow-x-auto mb-4 border border-slate-800 rounded-lg">
              <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-xs text-white uppercase bg-slate-900 border-b border-slate-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 border-r border-slate-800">Service / Part Type</th>
                    <th scope="col" className="px-6 py-3 border-r border-slate-800">Warranty Duration</th>
                    <th scope="col" className="px-6 py-3">Coverage Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-slate-950 border-b border-slate-800">
                    <td className="px-6 py-4 font-medium text-white border-r border-slate-800">Standard Repairs</td>
                    <td className="px-6 py-4 border-r border-slate-800">30 Days</td>
                    <td className="px-6 py-4">Manufacturer defects and workmanship on standard replacement parts.</td>
                  </tr>
                  <tr className="bg-slate-900">
                    <td className="px-6 py-4 font-medium text-cyan-400 border-r border-slate-800">Premium Parts</td>
                    <td className="px-6 py-4 border-r border-slate-800">90 Days</td>
                    <td className="px-6 py-4">Manufacturer defects and workmanship. Must be explicitly listed as "Premium Part" on invoice.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-slate-400">
              <li><strong className="text-slate-200">Warranty Coverage:</strong> Warranties only cover manufacturer defects in the specific replacement parts used and the workmanship of the specific repair performed.</li>
              <li><strong className="text-slate-200">Warranty Void Conditions:</strong> Warranties are strictly voided if the device shows signs of post-repair physical damage (drops, cracks, bent frames), liquid damage, tampering, or if the device is opened by the customer or another repair shop.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold text-cyan-400 mb-3 drop-shadow-[0_0_5px_rgba(6,182,212,0.3)]">
              3. Refurbished & Sold Device Warranty
            </h2>
            <p className="text-sm mb-3">
              All refurbished consoles and devices sold by JP's Tech Garage LLC include a 14-day limited hardware warranty starting from the date of purchase.
            </p>
            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-slate-400">
              <li><strong className="text-slate-200">Coverage:</strong> This warranty covers unexpected functional hardware failures (e.g., disc drive failure, overheating, power supply issues) that were not disclosed at the time of sale.</li>
              <li><strong className="text-slate-200">Void Conditions:</strong> This warranty is strictly voided if the device sustains physical damage, liquid exposure, power surges, or if the internal tamper-evident seals are broken or the device is opened by the buyer.</li>
              <li><strong className="text-slate-200">Returns:</strong> All device sales are final. Returns or exchanges are only provided for valid hardware warranty claims at the sole discretion of JP's Tech Garage LLC.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold text-cyan-400 mb-3 drop-shadow-[0_0_5px_rgba(6,182,212,0.3)]">
              4. Data Protection & Liability
            </h2>
            <p className="text-sm">
              While we take every precaution to protect your device, JP's Tech Garage LLC is not responsible for lost, deleted, or corrupted data. Customers are strongly encouraged to back up all personal data, game saves, and files prior to dropping off the device for repair.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold text-cyan-400 mb-3 drop-shadow-[0_0_5px_rgba(6,182,212,0.3)]">
              5. Pre-Existing & Underlying Conditions
            </h2>
            <p className="text-sm">
              We are only responsible for the specific repair listed on this invoice. Devices subjected to heavy physical trauma or liquid exposure may have microscopic or latent motherboard damage that becomes apparent during or after the repair process. JP's Tech Garage LLC is not liable for issues unrelated to the specific part replaced.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold text-cyan-400 mb-3 drop-shadow-[0_0_5px_rgba(6,182,212,0.3)]">
              6. Abandoned Devices
            </h2>
            <p className="text-sm">
              Devices left at the shop for more than 30 days after you have been notified of repair completion will be considered abandoned. Abandoned devices will be recycled, sold, or used for parts to recoup the cost of unpaid labor and hardware.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold text-cyan-400 mb-3 drop-shadow-[0_0_5px_rgba(6,182,212,0.3)]">
              7. Refunds
            </h2>
            <p className="text-sm">
              All repair sales are final. If a defect covered under warranty is found, JP's Tech Garage LLC will repair or replace the defective part at no additional cost. If the device is deemed unrepairable under warranty, a partial refund or store credit may be issued at our sole discretion. Diagnostic fees are non-refundable.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}