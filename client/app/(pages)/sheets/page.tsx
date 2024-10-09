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
import { inventryLocation } from "@/Data/Arrays";
import axios from "axios";
import { useEffect, useState } from "react";

export default function CardWithForm() {
  const [sheet, setSheet] = useState("");
  const [brandName, setBrandName] = useState("");
  const [link, setLink] = useState("");
  const [queryString, setQueryString] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState<
    Array<{
      brand: string;
    }>
  >([]);

  useEffect(() => {
    if (link) {
      const linkButton = document.createElement("a");
      linkButton.href = link;
      linkButton.click();
      linkButton.remove();
    }
  }, [link]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/product/brand`, {
        withCredentials: true,
      })
      .then((data) => {
        setBrand(data.data.brands);
      });
  }, []);

  return (
    <>
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
                <div className="flex w-full justify-center items-center">
                  <div className="grid w-11/12 grid-cols-2">
                    {Object.values(inventryLocation).map((key, index) => {
                      return (
                        <label className="flex gap-2" key={index} htmlFor={key}>
                          <input
                            onChange={(e) => {
                              console.log(e.target.checked);
                              if (e.target.checked) {
                                if (!queryString.includes(e.target.name))
                                  setQueryString((prev) => [
                                    ...prev,
                                    e.target.name,
                                  ]);
                              } else {
                                setQueryString((prev) =>
                                  prev.filter((item) => item !== e.target.name)
                                );
                              }
                            }}
                            type="checkbox"
                            name={Object.keys(inventryLocation)[index]}
                            id={key}
                          />
                          {key}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Without Image</Button>
            <Button
              onClick={() => {
                setLoading(true);
                setLink("");
                axios
                  .post(
                    `${
                      process.env.NEXT_PUBLIC_SERVER_URL
                    }/sheet/export?sheetName=${sheet}&brandName=${brandName}&${
                      queryString.length
                        ? `locationQuery=${queryString.join()}`
                        : ""
                    }`,
                    "_",
                    {
                      withCredentials: true,
                    }
                  )
                  .then((res) => {
                    setLoading(false);
                    setLink(res.data.link);
                    if (!res.data.link) {
                      alert("Something went wrong Please Contact to Developer");
                    }
                  })
                  .catch((err) => {
                    setLoading(false);
                    alert(
                      "Something went wrong Please try again in Some Seconds"
                    );
                  });
              }}
            >
              With Image
            </Button>
          </CardFooter>
        </Card>
      </div>
      {loading && <Loading />}
    </>
  );
}
