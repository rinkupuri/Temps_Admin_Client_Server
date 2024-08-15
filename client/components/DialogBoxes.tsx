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
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { FormEvent, useState } from "react";
import { bulkModelWiseInventry } from "@/Api/inventry.api";
import Loading from "./Loading";

export const BulkInventryUpdate = () => {
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
          <FcMultipleInputs title="Model Number Wise Inventry" size={18} />
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
          <form onSubmit={(e) => handelForm(e)}>
            <Textarea required placeholder="Paste Model Numbers Here" />
            <br />
            <div className="flex w-full justify-center items-center">
              <Button type="submit">Export</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Loading  */}
      {loading && <Loading />}
    </>
  );
};
