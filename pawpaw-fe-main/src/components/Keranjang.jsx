import React, { useEffect, useState } from 'react';
import { API_URL } from '../utils/constants';


function Keranjang() {
    const [currentCartId, setCurrentCartId] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [selectedDay, setSelectedDay] = useState('');

    const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

    React.useEffect(() => {
        // Cek dulu localStorage
        let savedCartId = localStorage.getItem('cart_id');

        if (!savedCartId) {
        // Kalau belum ada, fetch latest dari DB
        fetchLatestCartId();
        } else {
        setCurrentCartId(parseInt(savedCartId));
        fetchCartItems(parseInt(savedCartId));
        }
    }, []);

    // Fungsi Ambil Cart ID Terbaru 
    const fetchLatestCartId = async () => {
    try {
      const response = await fetch(`${API_URL}/keranjangs/latest_cart_id.php`);
      const data = await response.json();

      let newCartId = data.latest_cart_id !== null ? data.latest_cart_id : 1;
      setCurrentCartId(newCartId);
      localStorage.setItem('cart_id', newCartId);
      fetchCartItems(newCartId);
    } catch (error) {
      console.error('Error fetching latest cart ID:', error);
    }
  };

    
    // ini untuk ambil data dari database
    const fetchCartItems = async (cartId) => {
        try {
            const response = await fetch(`${API_URL}/keranjangs/?cart_id=${cartId}`, {
                method: "GET"
            });
            const data = await response.json();
            setCartItems(data);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    // untuk mengambil data menu dari API
    useEffect(() => {
  let savedCartId = localStorage.getItem('cart_id');

  if (!savedCartId) {
    fetchLatestCartId();
  } else {
    const parsedCartId = parseInt(savedCartId);
    setCurrentCartId(parsedCartId);
    fetchCartItems(parsedCartId);
  }
}, []);

useEffect(() => {
    if (currentCartId !== null) {
        console.log("Fetching cart items untuk cart_id:", currentCartId);
        fetchCartItems(currentCartId);
    }
}, [currentCartId]);

    // function ini untuk menghapus data
    const handleDelete = async (item) => {
    try {
        const response = await fetch(`${API_URL}/keranjangs/delete.php?menu_id=${item.menu_id}&cart_id=${currentCartId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Kamu berhasil menghapus menu di keranjang! Silakan tambah yang lain');
            fetchCartItems(currentCartId);
        } else {
            const data = await response.json();
            alert(`Gagal menghapus item: ${data.error || 'Error tidak diketahui'}`);
        }
    } catch (error) {
        console.error('Gagal menghapus/mengurangi menu:', error);
        alert('Gagal menghapus/mengurangi item');
    }
};


    const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity < 1) {
        // Kalau quantity kurang dari 1, langsung hapus item dari keranjang pakai delete.php
        try {
            const response = await fetch(`${API_URL}/keranjangs/delete.php?menu_id=${item.menu_id}&cart_id=${currentCartId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Item berhasil dihapus dari keranjang');
                fetchCartItems(currentCartId);
            } else {
                const data = await response.json();
                alert(`Gagal menghapus item: ${data.error || 'Error tidak diketahui'}`);
            }
        } catch (error) {
            console.error('Gagal menghapus item:', error);
            alert('Gagal menghapus item');
        }
        return;
    }

    // Kalau quantity >= 1, update quantity biasa pakai PUT
    try {
        const response = await fetch(`${API_URL}/keranjangs/update.php?menu_id=${item.menu_id}&cart_id=${currentCartId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...item,
                quantity: newQuantity,
                cart_id: currentCartId
            })
        });

        if (response.ok) {
            fetchCartItems(currentCartId);
        } else {
            alert('Gagal mengupdate jumlah item');
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        alert('Gagal mengupdate jumlah item');
    }
};


    // function ini untuk mengitung total harga per item
    const calculateItemTotal = (price, quantity) => {
        const numericPrice = price;
        return numericPrice * (quantity || 1);
    };

    // function ini untuk mengitung total harga semua item termasuk jumlahnya
    const calculateGrandTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + calculateItemTotal(item.price, item.quantity);
        }, 0);
    };

    const [isSaving, setIsSaving] = useState(false);

    const handleSaveCart = async () => {
          if (!selectedDay) {
            alert('Silakan pilih hari terlebih dahulu sebelum menyimpan.');
            return;
        }
          if (isSaving) return; // cegah klik dobel
            setIsSaving(true);
    try {
        await fetch(`${API_URL}/keranjangs/index.php`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cart_id: currentCartId,
            day: selectedDay,
            items: cartItems.map(item => ({
            menu_id: item.menu_id,
            quantity: item.quantity,
            })),
        }),
        });
      const response = await fetch(`${API_URL}/keranjangs/index.php?action=get_new_cart_id`);
      const data = await response.json();
      const newCartId = data.new_cart_id;
      setCartItems([]);
      setCurrentCartId(newCartId);
      localStorage.setItem('cart_id', newCartId);
      alert('Keranjang berhasil disimpan!');
    } catch (error) {
      console.error('Gagal menyimpan keranjang:', error);
      alert('Gagal menyimpan keranjang.');
    }finally {
    setIsSaving(false); // aktifkan tombol lagi setelah selesai
  }
  };


    // ini untuk tampilan tabel keranjang
    return (
        <section className="bg-white py-0">
  <div className="container mx-auto px-0">
    <div className="max-w-5xl mx-auto">
      <div className="w-full overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
            Keranjang Belanja
            <p className="mt-1 text-sm font-normal text-gray-500">
              Daftar item yang telah dipilih
            </p>
          </caption>
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap text-sm max-sm:text-xs">Nama Produk</th>
              <th className="px-4 py-3 whitespace-nowrap text-sm max-sm:text-xs">Harga</th>
              <th className="px-4 py-3 whitespace-nowrap text-sm max-sm:text-xs">Jumlah</th>
              <th className="px-4 py-3 whitespace-nowrap text-sm max-sm:text-xs">Total</th>
              <th className="px-4 py-3 whitespace-nowrap text-sm max-sm:text-xs">
                <span className="sr-only">Hapus</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                <th className="px-4 py-4 font-medium text-gray-900 max-w-[150px] break-words">{item.name}</th>
                <td className="px-4 py-4">Rp {item.price}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-col items-center space-y-1 sm:hidden">
                    <button
                      onClick={() => handleQuantityChange(item, (item.quantity || 1) + 1)}
                      className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      ▲
                    </button>
                    <span>{item.quantity || 1}</span>
                    <button
                      onClick={() => handleQuantityChange(item, (item.quantity || 1) - 1)}
                      className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Versi horizontal untuk sm ke atas */}
                  <div className="hidden sm:flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(item, (item.quantity || 1) - 1)}
                      className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span>{item.quantity || 1}</span>
                    <button
                      onClick={() => handleQuantityChange(item, (item.quantity || 1) + 1)}
                      className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4">
                  Rp {calculateItemTotal(item.price, item.quantity).toLocaleString()}
                </td>
                <td className="px-4 py-4 text-right">
  {/* Versi mobile: tombol 'x' */}
  <button
    onClick={() => handleDelete(item)}
    className="font-medium text-red-600 hover:underline sm:hidden"
    aria-label="Hapus item"
  >
    X
  </button>

  {/* Versi desktop/tablet: tombol 'Delete' */}
  <button
    onClick={() => handleDelete(item)}
    className="hidden sm:inline font-medium text-red-600 hover:underline"
  >
    Delete
  </button>
</td>
              </tr>
            ))}
            {cartItems.length === 0 && (
              <tr className="bg-white border-b">
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                  Keranjang masih kosong
                </td>
              </tr>
            )}
          </tbody>
          {cartItems.length > 0 && (
            <tfoot>
              <tr className="font-semibold text-gray-900">
                <td colSpan="3" className="px-4 py-4 text-right">Total Keseluruhan:</td>
                <td className="px-0 sm:px-4 py-4">Rp {calculateGrandTotal().toLocaleString()}</td>
                <td></td>
              </tr>
              <tr>
                <td colSpan="5" className="px-4 py-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y- sm:space-x-4">
                    <div className="self-end sm:self-auto flex items-center space-x-2">
                      <label htmlFor="day" className="text-sm font-medium text-gray-700">Pilih Hari:</label>
                      <select
                        id="day"
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                        className="block w-48 px-10 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-amber-700"
                      >
                        <option value="">-- Pilih Hari --</option>
                        {days.map((day) => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={handleSaveCart}
                      disabled={isSaving}
                      className={`self-end sm:self-auto text-base font-semibold text-white bg-amber-700 py-3 px-8 rounded-xl transition duration-300 ease-in-out 
                        ${isSaving ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg hover:opacity-80'}`}
                    >
                      {isSaving ? "Menyimpan..." : "Simpan Keranjang"}
                    </button>
                  </div>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  </div>
</section>

    );
}

export default Keranjang;