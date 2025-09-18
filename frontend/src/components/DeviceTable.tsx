import React from "react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Device } from "../types/device";
import { Eye, Edit, Trash2 } from "lucide-react";
import { formatDateWithEnglishNumerals } from "../utils/dateUtils";

interface DeviceTableProps {
  devices: Device[];
  onView: (device: Device) => void;
  onEdit: (device: Device) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
  totalCount?: number;
}

export const DeviceTable: React.FC<DeviceTableProps> = ({
  devices,
  onView,
  onEdit,
  onDelete,
  isLoading = false,
  totalCount,
}) => {
  const handleDeleteConfirm = (device: Device) => {
    onDelete(device.ID);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>قائمة الأجهزة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="text-muted-foreground">جاري التحميل...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          قائمة الأجهزة ({devices.length}
          {totalCount && totalCount !== devices.length && ` من ${totalCount}`})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {devices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {totalCount && totalCount > 0
              ? "لا توجد نتائج للبحث"
              : "لا توجد أجهزة مسجلة"}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الرقم التسلسلي</TableHead>
                <TableHead>اسم الجهاز</TableHead>
                <TableHead>نوع الجهاز</TableHead>
                <TableHead>تاريخ الإنشاء</TableHead>
                <TableHead className="text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.ID}>
                  <TableCell className="font-medium">
                    {device.SerialNumber}
                  </TableCell>
                  <TableCell>{device.DeviceName}</TableCell>
                  <TableCell>{device.DeviceType}</TableCell>
                  <TableCell>
                    {formatDateWithEnglishNumerals(device.CreatedAt)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2" dir="rtl">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(device)}
                        title="عرض التفاصيل"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(device)}
                        title="تعديل"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" title="حذف">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-start">
                              تأكيد الحذف
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-start">
                              هل أنت متأكد من حذف الجهاز "{device.DeviceName}"؟
                              <br />
                              <strong>الرقم التسلسلي:</strong>{" "}
                              {device.SerialNumber}
                              <br />
                              <span className="text-destructive">
                                لا يمكن التراجع عن هذا الإجراء.
                              </span>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-row-reverse gap-2">
                            <AlertDialogAction
                              onClick={() => handleDeleteConfirm(device)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              حذف
                            </AlertDialogAction>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
