"use client";
import { FcMultipleInputs } from "react-icons/fc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { FormEvent, useState } from "react";
import { bulkModelWiseInventry } from "@/Api/inventry.api";
import Loading from "../Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { BiImport } from "react-icons/bi";
import { inventryLocation } from "@/Data/Arrays";
import { Label } from "../ui/label";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Input } from "../ui/input";

export const Import = () => {
  const [loading, setLoading] = useState(false);
  const handelForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // @ts-ignore
    const dataString = e.target[0].value as string;
    await bulkModelWiseInventry(dataString);
    setLoading(false);
  };
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <BiImport title="Import" size={18} />
        </DialogTrigger>
        <DialogContent className="w-10/12">
          <DialogHeader>
            <DialogTitle>Pase Model Numbers</DialogTitle>
            <DialogDescription>
              Paste Model Like this : <br /> Sample1 <br /> Sample2 <br />{" "}
              Sample3
              <br /> Sample4 <br /> Sample5
            </DialogDescription>
          </DialogHeader>
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
                    <Label htmlFor="framework">Brand</Label>
                    <Select
                      onValueChange={(e: string) => {
                        console.log(e);
                      }}
                    >
                      <SelectTrigger id="framework">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value={"product"}>Product</SelectItem>
                        <SelectItem value="inventry">Inventry</SelectItem>
                        <SelectItem value="discount">Discount</SelectItem>
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
                  setLoading(true);
                }}
              >
                With Image
              </Button>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
      {/* Loading  */}
      {loading && <Loading />}
    </>
  );
};
