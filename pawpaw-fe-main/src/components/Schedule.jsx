import React, { useEffect, useState } from 'react';

const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const API_URL = 'http://localhost/my-api/keranjangs'; // sesuaikan dengan URL kamu

const Schedule = () => {
  const [scheduleData, setScheduleData] = useState({});

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(`${API_URL}/get_schedule.php`);
        const data = await response.json();
        const grouped = {};

        daysOfWeek.forEach(day => {
          grouped[day] = data.filter(item => item.day === day);
        });

        setScheduleData(grouped);
      } catch (error) {
        console.error('Gagal memuat data jadwal:', error);
      }
    };

    fetchSchedule();
  }, []);

  const calculateTotal = (items) => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  return (
    <div id="schedule" className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-center mb-8 text-amber-700">Jadwal Pemesanan per Hari</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {daysOfWeek.map(day => (
          <div key={day} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-amber-700 text-white text-center py-2 font-semibold text-lg">{day}</div>
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Nama Menu</th>
                  <th className="px-4 py-2">Jumlah</th>
                  <th className="px-4 py-2">Harga</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData[day]?.length > 0 ? (
                  scheduleData[day].map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.quantity}</td>
                      <td className="px-4 py-2">Rp {item.price.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-4 py-2 text-center text-gray-400">
                      Tidak ada pesanan
                    </td>
                  </tr>
                )}
              </tbody>
              {scheduleData[day]?.length > 0 && (
                <tfoot>
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-4 py-2 text-right" colSpan="2">Total:</td>
                    <td className="px-4 py-2">Rp {calculateTotal(scheduleData[day]).toLocaleString()}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
