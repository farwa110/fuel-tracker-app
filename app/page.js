"use client";
import { useState } from "react";
import Header from "@/app/components/Header";
import TabBar from "@/app/components/TabBar";
import MetricsRow from "@/app/components/MetricsRow";
import HeroCard from "@/app/components/HeroCard";
import FuelPills from "@/app/components/FuelPills";

export default function Page() {
  const [activeTab, setActiveTab] = useState("nearby");
  const [fuel, setFuel] = useState("benzin95");

  return (
    <>
      <Header updatedAt="2026-05-06T11:00:00" stationCount={412} />

      <div className="container" style={{ paddingTop: "1.25rem" }}>
        <TabBar activeTab={activeTab} onChange={setActiveTab} />

        <MetricsRow benzin={{ value: 15.89, delta: +0.12 }} diesel={{ value: 14.42, delta: -0.05 }} el={{ value: 3.85, delta: -0.08 }} />

        <HeroCard price={15.39} fuelLabel="Benzin 95" stationName="Circle K" address="Amager Strandvej" distanceKm={0.8} />

        <FuelPills selected={fuel} onChange={setFuel} />
      </div>
    </>
  );
}
