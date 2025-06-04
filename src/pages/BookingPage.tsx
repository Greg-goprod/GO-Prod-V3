import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { OfferForm } from '../components/booking/OfferForm';
import { OfferKanban } from '../components/booking/OfferKanban';

export const BookingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Booking Management"
        description="Manage artist bookings, offers, and contracts"
      />
      
      <div className="grid gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Active Offers</h2>
          <OfferKanban />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">New Booking</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <OfferForm />
          </div>
        </section>
      </div>
    </div>
  );
};

export default BookingPage;