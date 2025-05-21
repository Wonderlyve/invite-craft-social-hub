import { useState, useEffect } from "react";
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Check, X } from "lucide-react";
import { convertToGuest, Guest } from "@/types/guest";

interface CheckInModeProps {
  eventId: string;
  guest: Guest;
  onClose: () => void;
  onGuestUpdate: (guest: Guest) => void;
}

const CheckInMode = ({ eventId, guest, onClose, onGuestUpdate }: CheckInModeProps) => {
  const [checkedIn, setCheckedIn] = useState(guest.checked_in);
  const [guestData, setGuestData] = useState<Guest>(guest);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setGuestData(guest);
    setCheckedIn(guest.checked_in);
  }, [guest]);

  const handleCheckInToggle = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('guests')
        .update({ checked_in: !checkedIn })
        .eq('id', guest.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const updatedGuest = convertToGuest(data);
      setGuestData(updatedGuest);
      setCheckedIn(updatedGuest.checked_in);
      onGuestUpdate(updatedGuest);
      
      toast.success(`Guest ${updatedGuest.full_name} ${updatedGuest.checked_in ? 'checked in' : 'checked out'} successfully!`);
    } catch (error: any) {
      console.error("Error updating guest:", error);
      toast.error(`Failed to update guest: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuestData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleUpdateGuest = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('guests')
        .update({
          full_name: guestData.full_name,
          email: guestData.email
        })
        .eq('id', guest.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const updatedGuest = convertToGuest(data);
      setGuestData(updatedGuest);
      onGuestUpdate(updatedGuest);
      
      toast.success(`Guest ${updatedGuest.full_name} updated successfully!`);
    } catch (error: any) {
      console.error("Error updating guest:", error);
      toast.error(`Failed to update guest: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Check-In Mode</CardTitle>
        <CardDescription>Manage guest check-in status and details.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            type="text" 
            id="name" 
            name="full_name"
            defaultValue={guestData.full_name} 
            onChange={handleInputChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            type="email" 
            id="email" 
            name="email"
            defaultValue={guestData.email || ""} 
            onChange={handleInputChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="check-in">Checked In</Label>
          <Switch 
            id="check-in" 
            checked={checkedIn} 
            onCheckedChange={handleCheckInToggle}
            disabled={loading}
          />
        </div>
        <div className="flex justify-between">
          <Button variant="ghost" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleUpdateGuest} disabled={loading}>
            <Check className="w-4 h-4 mr-2" />
            Update Guest
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckInMode;
