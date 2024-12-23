'use client';

import PractitionerRegistrationForm from './practitionerform';

export default function PatientRegister() {
  return (
      <div className='w-2/4 m-auto flex flex-col gap-14 justify-center mt-40 border-4 border-white rounded-2xl p-12 shadow-md'>
        <header className='text-2xl font-bold text-white text-center'>
          Practitioner Registration Form
        </header>
        <PractitionerRegistrationForm />
      </div>
  );
}
