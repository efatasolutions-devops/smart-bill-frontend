import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Receipt, Upload } from "lucide-react";

export default function UploadStruk() {
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);

  return (
    <Card className="card-modern border-0 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-slate-800 flex items-center gap-3 font-display text-2xl">
          <Upload className="w-7 h-7 text-primary-600" />
          Upload Struk
        </CardTitle>
        <CardDescription className="font-body text-base">
          Upload foto struk untuk diproses secara otomatis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-16 text-center hover:border-primary-400 transition-colors">
          <Upload className="w-20 h-20 mx-auto mb-8 text-slate-400" />
          <p className="text-slate-600 mb-8 text-lg font-body">
            Drag & drop atau klik untuk upload struk
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Label htmlFor="file-upload">
            <Button
              className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 px-10 py-4 rounded-xl font-display font-semibold btn-modern"
              asChild
            >
              <span>Pilih File</span>
            </Button>
          </Label>
          {uploadedFile && (
            <div className="mt-10 p-8 bg-slate-50 rounded-2xl">
              <Receipt className="w-10 h-10 mx-auto mb-4 text-primary-600" />
              <p className="text-slate-700 font-medium font-body text-lg">
                Memproses: {uploadedFile.name}
              </p>
              <div className="w-full bg-slate-200 rounded-full h-4 mt-6">
                <div
                  className="bg-gradient-to-r from-accent-500 to-accent-600 h-4 rounded-full animate-pulse transition-all duration-1000"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
