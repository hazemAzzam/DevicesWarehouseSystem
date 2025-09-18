import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Device } from "../types/device";
import { formatDateWithEnglishNumerals } from "../utils/dateUtils";

interface DeviceViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
}

export const DeviceViewDialog: React.FC<DeviceViewDialogProps> = ({
  isOpen,
  onClose,
  device,
}) => {
  if (!device) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>تفاصيل الجهاز</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">معلومات الجهاز</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    اسم الجهاز:
                  </label>
                  <p className="text-sm font-medium">{device.DeviceName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    نوع الجهاز:
                  </label>
                  <p className="text-sm font-medium">{device.DeviceType}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    الرقم التسلسلي:
                  </label>
                  <p className="text-sm font-medium font-mono bg-muted p-2 rounded">
                    {device.SerialNumber}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">معلومات النظام</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    تاريخ الإنشاء:
                  </label>
                  <p className="text-sm font-medium">
                    {formatDateWithEnglishNumerals(device.CreatedAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    آخر تحديث:
                  </label>
                  <p className="text-sm font-medium">
                    {formatDateWithEnglishNumerals(device.UpdatedAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    معرف الجهاز:
                  </label>
                  <p className="text-sm font-medium">#{device.ID}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
