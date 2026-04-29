import { useState } from 'react';
import { useNavigate } from 'react-router';
import { LogOut, Laptop as LaptopIcon, Phone, Plus, Pencil, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { loadLaptops, saveLaptops, loadStoreConfig, saveStoreConfig } from '@/data/laptops';
import type { Laptop, StoreConfig } from '@/types/laptop';

const emptyLaptop: Laptop = {
  id: 0,
  model: '',
  brand: '',
  processor: '',
  graphics: '',
  display: '',
  memory: '',
  storage: '',
  os: '',
  color: '',
  condition: 'New',
  notes: '',
  price: null,
  category: 'Gaming',
  image: '/images/laptop-hp-pavilion.png',
};

export default function Admin() {
  const { isAuthenticated, login, logout } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
        <div className="w-full max-w-[400px] bg-[#0a0a0a] border border-[#1a1a1a] p-8">
          <button
            onClick={() => navigate('/')}
            className="text-eyebrow text-[#555555] hover:text-[#f5f5f0] flex items-center gap-2 mb-8 transition-colors"
            style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}
          >
            <ArrowLeft size={14} /> Back to Gallery
          </button>

          <h2 className="font-display text-3xl text-[#f5f5f0] mb-2">
            Admin Access
          </h2>
          <p className="font-body text-sm text-[#8a8a8a] mb-8">
            Enter your credentials to access the admin dashboard.
          </p>

          <div className="space-y-4">
            <div>
              <label
                className="text-eyebrow text-[#555555] block mb-2"
                style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}
              >
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (!login(password)) setError('Invalid password');
                  }
                }}
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] text-[#f5f5f0] p-3 font-body text-sm focus:border-[#c8a45c] focus:outline-none transition-colors"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <p className="text-eyebrow text-red-400" style={{ fontSize: '0.7rem' }}>
                {error}
              </p>
            )}

            <button
              onClick={() => {
                if (!login(password)) setError('Invalid password');
              }}
              className="w-full bg-[#c8a45c] text-[#050505] py-3 text-eyebrow uppercase hover:bg-[#d4b76a] transition-colors"
              style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={logout} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'laptops' | 'contact'>('laptops');
  const [laptops, setLaptops] = useState<Laptop[]>(loadLaptops);
  const [config, setConfig] = useState<StoreConfig>(loadStoreConfig);
  const [editingLaptop, setEditingLaptop] = useState<Laptop | null>(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleSaveLaptops = (updated: Laptop[]) => {
    setLaptops(updated);
    saveLaptops(updated);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this laptop?')) {
      handleSaveLaptops(laptops.filter((l) => l.id !== id));
    }
  };

  const handleSaveEdit = (laptop: Laptop) => {
    if (laptop.id === 0) {
      const newId = Math.max(...laptops.map((l) => l.id), 0) + 1;
      const brand = laptop.model.split(' ')[0] || '';
      const newLaptop = { ...laptop, id: newId, brand };
      handleSaveLaptops([...laptops, newLaptop]);
    } else {
      const brand = laptop.model.split(' ')[0] || laptop.brand;
      handleSaveLaptops(laptops.map((l) => (l.id === laptop.id ? { ...laptop, brand } : l)));
    }
    setEditingLaptop(null);
    setShowForm(false);
  };

  const handleSaveConfig = () => {
    saveStoreConfig(config);
    alert('Contact info saved!');
  };

  const handleAddNew = () => {
    setEditingLaptop({ ...emptyLaptop });
    setShowForm(true);
  };

  const handleEdit = (laptop: Laptop) => {
    setEditingLaptop({ ...laptop });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Sidebar */}
      <aside className="w-[200px] bg-[#0a0a0a] border-r border-[#1a1a1a] fixed h-full hidden md:flex flex-col">
        <div className="p-6">
          <span
            className="text-eyebrow text-[#c8a45c]"
            style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}
          >
            ALEXSTORE ADMIN
          </span>
        </div>

        <nav className="flex-1 px-4">
          <button
            onClick={() => setActiveTab('laptops')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-eyebrow transition-colors ${
              activeTab === 'laptops'
                ? 'text-[#f5f5f0] bg-[#1a1a1a]'
                : 'text-[#8a8a8a] hover:text-[#f5f5f0]'
            }`}
            style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}
          >
            <LaptopIcon size={16} /> Laptops
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-eyebrow transition-colors ${
              activeTab === 'contact'
                ? 'text-[#f5f5f0] bg-[#1a1a1a]'
                : 'text-[#8a8a8a] hover:text-[#f5f5f0]'
            }`}
            style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}
          >
            <Phone size={16} /> Contact Info
          </button>
        </nav>

        <div className="p-4 border-t border-[#1a1a1a]">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 text-eyebrow text-[#8a8a8a] hover:text-[#f5f5f0] transition-colors mb-2"
            style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-eyebrow text-[#8a8a8a] hover:text-red-400 transition-colors"
            style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0a0a0a] border-b border-[#1a1a1a] flex items-center justify-between px-4 py-3">
        <span className="text-eyebrow text-[#c8a45c]" style={{ fontSize: '0.7rem' }}>
          ADMIN
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('laptops')}
            className={`text-eyebrow px-3 py-1.5 ${activeTab === 'laptops' ? 'text-[#f5f5f0]' : 'text-[#555555]'}`}
            style={{ fontSize: '0.65rem' }}
          >
            Laptops
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`text-eyebrow px-3 py-1.5 ${activeTab === 'contact' ? 'text-[#f5f5f0]' : 'text-[#555555]'}`}
            style={{ fontSize: '0.65rem' }}
          >
            Contact
          </button>
          <button onClick={onLogout} className="text-[#555555]">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-[200px] p-6 lg:p-10 pt-20 md:pt-10">
        {activeTab === 'laptops' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl text-[#f5f5f0]">
                Laptops ({laptops.length})
              </h2>
              <button
                onClick={handleAddNew}
                className="bg-[#c8a45c] text-[#050505] px-5 py-2.5 text-eyebrow uppercase flex items-center gap-2 hover:bg-[#d4b76a] transition-colors"
                style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}
              >
                <Plus size={14} /> Add New
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1a1a1a]">
                    <th className="text-left text-eyebrow text-[#555555] py-3 px-4" style={{ fontSize: '0.65rem' }}>
                      MODEL
                    </th>
                    <th className="text-left text-eyebrow text-[#555555] py-3 px-4 hidden lg:table-cell" style={{ fontSize: '0.65rem' }}>
                      PROCESSOR
                    </th>
                    <th className="text-left text-eyebrow text-[#555555] py-3 px-4 hidden md:table-cell" style={{ fontSize: '0.65rem' }}>
                      PRICE
                    </th>
                    <th className="text-left text-eyebrow text-[#555555] py-3 px-4" style={{ fontSize: '0.65rem' }}>
                      CONDITION
                    </th>
                    <th className="text-right text-eyebrow text-[#555555] py-3 px-4" style={{ fontSize: '0.65rem' }}>
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {laptops.map((laptop) => (
                    <tr
                      key={laptop.id}
                      className="border-b border-[#1a1a1a]/50 hover:bg-[#0a0a0a] transition-colors"
                    >
                      <td className="py-3 px-4 font-body text-sm text-[#f5f5f0]">
                        {laptop.model}
                      </td>
                      <td className="py-3 px-4 font-body text-sm text-[#8a8a8a] hidden lg:table-cell">
                        {laptop.processor}
                      </td>
                      <td className="py-3 px-4 font-body text-sm text-[#c8a45c] hidden md:table-cell">
                        {laptop.price ? laptop.price.toLocaleString() + ' EGP' : 'Inquire'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-eyebrow ${
                            laptop.condition.toLowerCase().includes('new')
                              ? 'text-emerald-400'
                              : 'text-[#8a8a8a]'
                          }`}
                          style={{ fontSize: '0.7rem' }}
                        >
                          {laptop.condition || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(laptop)}
                            className="text-[#555555] hover:text-[#c8a45c] transition-colors p-1"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(laptop.id)}
                            className="text-[#555555] hover:text-red-400 transition-colors p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div>
            <h2 className="font-display text-3xl text-[#f5f5f0] mb-8">
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[600px]">
              <FormInput
                label="Phone"
                value={config.phone}
                onChange={(v) => setConfig({ ...config, phone: v })}
              />
              <FormInput
                label="WhatsApp Number"
                value={config.whatsapp}
                onChange={(v) => setConfig({ ...config, whatsapp: v })}
              />
              <FormInput
                label="Location"
                value={config.location}
                onChange={(v) => setConfig({ ...config, location: v })}
              />
              <FormInput
                label="Working Hours"
                value={config.hours}
                onChange={(v) => setConfig({ ...config, hours: v })}
              />
              <FormInput
                label="Facebook URL"
                value={config.facebook}
                onChange={(v) => setConfig({ ...config, facebook: v })}
              />
              <FormInput
                label="Instagram URL"
                value={config.instagram}
                onChange={(v) => setConfig({ ...config, instagram: v })}
              />
              <FormInput
                label="Telegram URL"
                value={config.telegram}
                onChange={(v) => setConfig({ ...config, telegram: v })}
              />
            </div>

            <button
              onClick={handleSaveConfig}
              className="mt-8 bg-[#c8a45c] text-[#050505] px-8 py-3 text-eyebrow uppercase flex items-center gap-3 hover:bg-[#d4b76a] transition-colors"
              style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}
            >
              <Save size={16} /> Save Changes
            </button>
          </div>
        )}
      </main>

      {/* Edit/Add Form Overlay */}
      {showForm && editingLaptop && (
        <div className="fixed inset-0 z-50 bg-[#050505]/90 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-[480px] bg-[#0a0a0a] border-l border-[#1a1a1a] overflow-y-auto h-full p-6 lg:p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display text-2xl text-[#f5f5f0]">
                {editingLaptop.id === 0 ? 'Add Laptop' : 'Edit Laptop'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingLaptop(null);
                }}
                className="text-[#555555] hover:text-[#f5f5f0]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <FormInput
                label="Model"
                value={editingLaptop.model}
                onChange={(v) => setEditingLaptop({ ...editingLaptop, model: v })}
              />
              <FormInput
                label="Processor"
                value={editingLaptop.processor}
                onChange={(v) => setEditingLaptop({ ...editingLaptop, processor: v })}
              />
              <FormInput
                label="Graphics"
                value={editingLaptop.graphics}
                onChange={(v) => setEditingLaptop({ ...editingLaptop, graphics: v })}
              />
              <FormInput
                label="Display"
                value={editingLaptop.display}
                onChange={(v) => setEditingLaptop({ ...editingLaptop, display: v })}
              />
              <FormInput
                label="Memory"
                value={editingLaptop.memory}
                onChange={(v) => setEditingLaptop({ ...editingLaptop, memory: v })}
              />
              <FormInput
                label="Storage"
                value={editingLaptop.storage}
                onChange={(v) => setEditingLaptop({ ...editingLaptop, storage: v })}
              />
              <FormInput
                label="OS"
                value={editingLaptop.os}
                onChange={(v) => setEditingLaptop({ ...editingLaptop, os: v })}
              />
              <FormInput
                label="Condition"
                value={editingLaptop.condition}
                onChange={(v) => setEditingLaptop({ ...editingLaptop, condition: v })}
              />
              <div>
                <label className="text-eyebrow text-[#555555] block mb-2" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                  PRICE (EGP)
                </label>
                <input
                  type="number"
                  value={editingLaptop.price || ''}
                  onChange={(e) =>
                    setEditingLaptop({
                      ...editingLaptop,
                      price: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="w-full bg-[#0a0a0a] border border-[#1a1a1a] text-[#f5f5f0] p-3 font-body text-sm focus:border-[#c8a45c] focus:outline-none transition-colors"
                  placeholder="Leave empty for 'Price on Request'"
                />
              </div>
              <FormInput
                label="Notes"
                value={editingLaptop.notes}
                onChange={(v) => setEditingLaptop({ ...editingLaptop, notes: v })}
              />
              <div>
                <label className="text-eyebrow text-[#555555] block mb-2" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                  CATEGORY
                </label>
                <select
                  value={editingLaptop.category}
                  onChange={(e) =>
                    setEditingLaptop({ ...editingLaptop, category: e.target.value })
                  }
                  className="w-full bg-[#0a0a0a] border border-[#1a1a1a] text-[#f5f5f0] p-3 font-body text-sm focus:border-[#c8a45c] focus:outline-none transition-colors"
                >
                  <option value="Gaming">Gaming</option>
                  <option value="Business">Business</option>
                  <option value="Budget">Budget</option>
                </select>
              </div>

              <button
                onClick={() => handleSaveEdit(editingLaptop)}
                className="w-full bg-[#c8a45c] text-[#050505] py-3 text-eyebrow uppercase hover:bg-[#d4b76a] transition-colors mt-6"
                style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}
              >
                {editingLaptop.id === 0 ? 'Add Laptop' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label
        className="text-eyebrow text-[#555555] block mb-2"
        style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}
      >
        {label.toUpperCase()}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0a0a0a] border border-[#1a1a1a] text-[#f5f5f0] p-3 font-body text-sm focus:border-[#c8a45c] focus:outline-none transition-colors"
      />
    </div>
  );
}
