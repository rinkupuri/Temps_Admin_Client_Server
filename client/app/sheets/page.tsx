"use client";

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

export default function CardWithForm() {
  const [sheet, setSheet] = useState("");
  const [brandName, setBrandName] = useState("");
  const [link, setLink] = useState("");
  const [brand, setBrand] = useState<
    Array<{
      brand: string;
    }>
  >([]);

  useEffect(() => {
    if (link) {
      window.open(link);
    }
  }, [link]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/product/brand`)
      .then((data) => {
        setBrand(data.data.brands);
      });
  }, []);

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Export Sheets</CardTitle>
          <CardDescription>
            Export all brand image sheet with stock
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Sheet Name</Label>
                <Input
                  onChange={(e) => setSheet(e.target.value)}
                  id="name"
                  placeholder="Name of your project"
                  value={sheet}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Brand</Label>
                <Select
                  onValueChange={(e: string) => {
                    setBrandName(e);
                  }}
                >
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {brand.map((item, index) => (
                      <SelectItem key={index} value={item.brand}>
                        {item.brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Without Image</Button>
          <Button
            onClick={() => {
              axios
                .post(
                  `${process.env.NEXT_PUBLIC_SERVER_URL}/sheet/export?sheetName=${sheet}&brandName=${brandName}`
                )
                .then((res) => {
                  setLink(res.data.link);
                });
            }}
          >
            With Image
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
