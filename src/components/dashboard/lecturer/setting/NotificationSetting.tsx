import { useState, useEffect } from 'react';
import { notificationService } from '../../../../apis/notification'; 

const NotificationSetting = () => {
  const [settings, setSettings] = useState({
    enrollment: true,
    comment: true,
    assignment: true,
    email: true,
    doNotDisturb: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getNotificationSettingsAPI();
        
        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error("Lỗi tải cài đặt thông báo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleToggle = async (key: keyof typeof settings) => {
    const newValue = !settings[key];

    setSettings(prev => ({
      ...prev,
      [key]: newValue
    }));

    try {
      await notificationService.updateNotificationSettingAPI({
        [key]: newValue
      });
      
      console.log(`Đã cập nhật ${key}: ${newValue} lên Server thành công!`);
    } catch (error) {
      console.error("Lỗi khi lưu cài đặt, đang hoàn tác...", error);

      setSettings(prev => ({
        ...prev,
        [key]: !newValue
      }));
      
      alert("Không thể lưu thay đổi lúc này. Vui lòng thử lại!"); 
    }
  };

  const ToggleSwitch = ({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) => (
    <button 
      onClick={onToggle}
      className={`
        relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none
        ${isOn ? 'bg-blue-600' : 'bg-gray-400'} 
      `}
    >
      <span
        className={`
          inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-sm
          ${isOn ? 'translate-x-6' : 'translate-x-1'} 
        `}
      />
    </button>
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-8 font-poppins uppercase">Notification Settings</h2>
      
      {loading ? (
        <div className="text-gray-500 italic py-4">Đang tải cài đặt của bạn...</div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <span className="text-gray-700 font-medium">New student enrollment</span>
              <ToggleSwitch isOn={settings.enrollment} onToggle={() => handleToggle('enrollment')} />
          </div>

          <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <span className="text-gray-700 font-medium">Course comment or question</span>
              <ToggleSwitch isOn={settings.comment} onToggle={() => handleToggle('comment')} />
          </div>

          <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <span className="text-gray-700 font-medium">Assignment submission</span>
              <ToggleSwitch isOn={settings.assignment} onToggle={() => handleToggle('assignment')} />
          </div>

          <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <span className="text-gray-700 font-medium">Email</span>
              <ToggleSwitch isOn={settings.email} onToggle={() => handleToggle('email')} />
          </div>

          <div className="flex items-center justify-between pt-2">
              <span className="text-gray-700 font-medium">Do Not Disturb</span>
              <ToggleSwitch isOn={settings.doNotDisturb} onToggle={() => handleToggle('doNotDisturb')} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSetting;