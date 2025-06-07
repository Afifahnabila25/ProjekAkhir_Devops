import React from 'react';

function HeroSection() {
  return (
    <section id="home" className="h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-center lg:justify-between">
          {/* gambar */}
          <div className="w-full self-center px-4 mb-12 lg:mb-0 pt-0 mt-0  lg:w-1/2">
            <img
              src="assets/naspad.png"
              alt="Nasi Padang"
              className="max-w-full mx-auto lg:mx-0"
            />
          </div>


          {/* teks */}
          <div className="w-full self-center px-4 text-center lg:text-right pt-0.5  lg:w-1/2">
            <h1 className="text-4xl font-bold text-amber-700 mb-4 md:text-4xl lg:text-6xl">
              Kamu Lapar?
            </h1>
            <p className="font-medium text-amber-700 text-lg mb-8 lg:text-2xl md:text-xl">
            Nikmati kemudahan belanja tanpa repot! Tak perlu buang waktu berdiri dalam antrean panjang—cukup pilih, klik, dan pesananmu langsung diproses. Dengan layanan cepat dan praktis, kamu bisa mendapatkan apa yang kamu butuhkan tanpa ribet. Yuk, belanja lebih mudah sekarang!
            </p>
            <a
              href="#"
              className="text-base font-semibold text-white bg-amber-700 py-3 px-8 rounded-xl hover:shadow-lg hover:opacity-80 transition duration-300 ease-in-out"
            >
              Pesan sekarang!
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
