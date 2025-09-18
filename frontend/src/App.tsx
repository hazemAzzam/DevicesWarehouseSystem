import React, { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { DeviceTable } from "./components/DeviceTable";
import { DeviceForm } from "./components/DeviceForm";
import { DeviceViewDialog } from "./components/DeviceViewDialog";
import { SearchBar } from "./components/SearchBar";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/theme-provider";
import { ThemeToggle } from "./components/theme-toggle";
import { Device, DeviceFormData } from "./types/device";
import { DeviceService } from "./services/deviceService";
import { useToast } from "./hooks/use-toast";
import { Plus, Package } from "lucide-react";

function App() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const { toast } = useToast();

  // تحميل الأجهزة عند بدء التطبيق
  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setIsLoading(true);
      const data = await DeviceService.getAllDevices();
      setDevices(data);
      setFilteredDevices(data);
    } catch (error) {
      console.error("Error loading devices:", error);
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء تحميل الأجهزة",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDevice = async (deviceData: DeviceFormData) => {
    try {
      await DeviceService.addDevice(deviceData);
      await loadDevices();
      toast({
        title: "تم بنجاح",
        description: "تم إضافة الجهاز بنجاح",
      });
    } catch (error) {
      console.error("Error adding device:", error);
      toast({
        title: "خطأ في الإضافة",
        description: "حدث خطأ أثناء إضافة الجهاز",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleUpdateDevice = async (deviceData: DeviceFormData) => {
    if (!editingDevice) return;

    try {
      await DeviceService.updateDevice(editingDevice.ID, deviceData);
      await loadDevices();
      setEditingDevice(null);
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث الجهاز بنجاح",
      });
    } catch (error) {
      console.error("Error updating device:", error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث الجهاز",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDeleteDevice = async (id: number) => {
    try {
      await DeviceService.deleteDevice(id);
      await loadDevices();
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف الجهاز بنجاح",
      });
    } catch (error) {
      console.error("Error deleting device:", error);
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف الجهاز",
        variant: "destructive",
      });
    }
  };

  const handleViewDevice = (device: Device) => {
    setSelectedDevice(device);
    setIsViewDialogOpen(true);
  };

  const handleEditDevice = (device: Device) => {
    setEditingDevice(device);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDevice(null);
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredDevices(devices);
      return;
    }

    const filtered = devices.filter((device) => {
      const searchTerm = query.toLowerCase();
      return (
        device.DeviceName.toLowerCase().includes(searchTerm) ||
        device.DeviceType.toLowerCase().includes(searchTerm) ||
        device.SerialNumber.toLowerCase().includes(searchTerm)
      );
    });

    setFilteredDevices(filtered);
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background" dir="rtl">
        {/* Navbar */}
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-primary" />
                <div className="text-right">
                  <h1 className="text-xl font-bold">نظام مخزن الأجهزة</h1>
                  <p className="text-sm text-muted-foreground">
                    إدارة وتتبع الأجهزة والرقم التسلسلي
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Button
                  onClick={() => setIsFormOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  إضافة جهاز جديد
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} />

          {/* Device Table */}
          <DeviceTable
            devices={filteredDevices}
            onView={handleViewDevice}
            onEdit={handleEditDevice}
            onDelete={handleDeleteDevice}
            isLoading={isLoading}
            totalCount={devices.length}
          />

          {/* Add/Edit Device Form */}
          <DeviceForm
            isOpen={isFormOpen}
            onClose={handleCloseForm}
            onSubmit={editingDevice ? handleUpdateDevice : handleAddDevice}
            device={editingDevice}
            title={editingDevice ? "تعديل الجهاز" : "إضافة جهاز جديد"}
          />

          {/* View Device Dialog */}
          <DeviceViewDialog
            isOpen={isViewDialogOpen}
            onClose={() => setIsViewDialogOpen(false)}
            device={selectedDevice}
          />
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
