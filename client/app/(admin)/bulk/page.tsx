"use client";

import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useEffect, useState } from "react";

// Example JSON for dropdown data
const dropdownData = [
  {
    name: "Create Image Sheet",
    api: `${process.env.NEXT_PUBLIC_SERVER_URL}/sheet/create`,
  },
  {
    name: "Offer Update",
    api: `${process.env.NEXT_PUBLIC_SERVER_URL}/product/offerupdate`,
  },
];

export default function UploadFormWithDropdown() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState<string>("");

  useEffect(() => {
    if (selectedOption) {
      const selected = dropdownData.find(
        (option) => option.name === selectedOption
      );
      setApiUrl(selected ? selected.api : "");
    }
  }, [selectedOption]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const uploadedFile = event.target.files[0];
      if (uploadedFile.type === "text/csv") {
        setFile(uploadedFile);
      } else {
        alert("Please upload a CSV file.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption || !file) {
      alert("Please select an option and upload a file.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("csvData", file);

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      alert("File uploaded successfully!");
    } catch (error) {
      alert("An error occurred while uploading the file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex w-full h-screen justify-center items-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Upload CSV File</CardTitle>
            <CardDescription>
              Choose an option and upload a CSV file.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="dropdown">Options</Label>
                  <Select
                    onValueChange={(value: string) => setSelectedOption(value)}
                  >
                    <SelectTrigger id="dropdown">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {dropdownData.map((item, index) => (
                        <SelectItem key={index} value={item.name}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="fileUpload">Upload CSV File</Label>
                  <Input
                    type="file"
                    id="fileUpload"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <CardFooter className="flex justify-between mt-4">
                <Button type="submit" disabled={loading || !file}>
                  Upload
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
      {loading && <Loading />}
    </>
  );
}
