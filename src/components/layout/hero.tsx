'use client';

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, MapPin, Clock, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Color variables that can be easily adjusted
const colors = {
  primary: "text-primary",
  accent: "text-blue-500", // This can be customized
  background: "bg-background",
  muted: "text-muted-foreground",
};

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-36 bg-background">
      <div className="container px-4 md:px-6 mx-auto grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
        {/* Left side content */}
        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Quality Service{" "}
              <span className={cn("font-extrabold", colors.accent)}>You Can Trust</span>
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Serving our local community since 2005 with pride, dedication, and attention to detail.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="px-8">
              Contact Us
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              Our Services
            </Button>
          </div>
          <div className="flex flex-col space-y-2 text-sm font-medium pt-2">
            <span className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-primary" />
              123 Main Street, Your Town
            </span>
            <span className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-primary" />
              Mon-Fri: 9AM-6PM | Sat: 10AM-4PM
            </span>
            <span className="flex items-center">
              <Phone className="mr-2 h-4 w-4 text-primary" />
              (555) 123-4567
            </span>
          </div>
        </div>
        
        {/* Right side - Space for logo and business highlights */}
        <div className="flex flex-col items-center justify-center">
          {/* Large logo placeholder */}
          <div className="w-full max-w-[350px] aspect-square bg-muted/20 rounded-lg border-2 border-dashed border-muted flex items-center justify-center mb-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Your Business Logo</p>
              <p className="text-xs text-muted-foreground/70">(350 × 350px recommended)</p>
            </div>
          </div>
          
          {/* Business highlights cards */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <Card className="border shadow-sm">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Experience</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-bold">15+ Years</p>
                <p className="text-sm text-muted-foreground">Serving customers</p>
              </CardContent>
            </Card>
            
            <Card className="border shadow-sm">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Satisfaction</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-bold">100%</p>
                <p className="text-sm text-muted-foreground">Guaranteed</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
} 