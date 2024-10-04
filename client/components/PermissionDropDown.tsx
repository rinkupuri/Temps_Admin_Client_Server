import { useState } from "react";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { useDispatch } from "react-redux";
import { useUpdateUserPermissionMutation } from "@/Redux/RTK/user.api"; // Define this API later
import { User } from "@/types/types";
import { Button } from "./ui/button";

export const PermissionCell = ({ user }: { user: User }) => {
  const [selectedPermissions, setSelectedPermissions] = useState(
    user.Permission || []
  );
  const [updateUserPermission] = useUpdateUserPermissionMutation();
  const dispatch = useDispatch();

  const allPermissions = ["products", "search", "sheets", "orders"];

  const handlePermissionChange = async (permission: string) => {
    let updatedPermissions = [...selectedPermissions];
    if (selectedPermissions.includes(permission)) {
      updatedPermissions = updatedPermissions.filter((p) => p !== permission);
    } else {
      updatedPermissions.push(permission);
    }
    setSelectedPermissions(updatedPermissions);

    // Send API call to update the user's permissions
    await updateUserPermission({
      id: user.id,
      permissions: updatedPermissions,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Change</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {allPermissions.map((permission) => (
          <DropdownMenuCheckboxItem
            key={permission}
            checked={selectedPermissions.includes(permission)}
            onCheckedChange={() => handlePermissionChange(permission)}
          >
            {permission}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
