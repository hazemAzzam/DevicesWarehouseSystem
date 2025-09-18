import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Device, DeviceFormData } from "../types/device";
import { useToast } from "../hooks/use-toast";

interface DeviceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DeviceFormData) => Promise<void>;
  device?: Device | null;
  title: string;
}

export const DeviceForm: React.FC<DeviceFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  device,
  title,
}) => {
  const [formData, setFormData] = useState<DeviceFormData>({
    deviceName: "",
    deviceType: "",
    serialNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (device) {
      setFormData({
        deviceName: device.DeviceName,
        deviceType: device.DeviceType,
        serialNumber: device.SerialNumber,
      });
    } else {
      setFormData({
        deviceName: "",
        deviceType: "",
        serialNumber: "",
      });
    }
  }, [device, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.deviceName ||
      !formData.deviceType ||
      !formData.serialNumber
    ) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof DeviceFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deviceName">اسم الجهاز</Label>
            <Input
              id="deviceName"
              value={formData.deviceName}
              onChange={(e) => handleInputChange("deviceName", e.target.value)}
              placeholder="أدخل اسم الجهاز"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deviceType">نوع الجهاز</Label>
            <Input
              id="deviceType"
              value={formData.deviceType}
              onChange={(e) => handleInputChange("deviceType", e.target.value)}
              placeholder="أدخل نوع الجهاز"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="serialNumber">الرقم التسلسلي</Label>
            <Input
              id="serialNumber"
              value={formData.serialNumber}
              onChange={(e) =>
                handleInputChange("serialNumber", e.target.value)
              }
              placeholder="أدخل الرقم التسلسلي"
              required
            />
          </div>
          <DialogFooter className="flex-row-reverse">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "جاري الحفظ..." : "حفظ"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
