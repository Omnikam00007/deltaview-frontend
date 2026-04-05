"use client"

import KPIRow from "./kpi-row"
import AccountValueCurve from "./account-value-curve"
import AssetAllocationDonut from "./asset-allocation-donut"
import SectorExposureChart from "./sector-exposure-chart"
import RecentActivityFeed from "./recent-activity-feed"
import PortfolioHeatmap from "./portfolio-heatmap"
import HoldingsTable from "./holdings-table"
import BottomWidgets from "./bottom-widgets"

export default function Content() {
  return (
    <div className="flex flex-col gap-6">
      {/* 2. Dashboard Overview */}
      <KPIRow />

      {/* 3. Main Chart Area */}
      <div className="h-[450px]">
        <AccountValueCurve />
      </div>

      {/* 4. Dashboard Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - 55% */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="h-[420px]">
             <AssetAllocationDonut />
          </div>
          <div className="h-[380px]">
             <SectorExposureChart />
          </div>
        </div>

        {/* Right Column - 45% */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="h-[420px]">
             <RecentActivityFeed />
          </div>
          <div className="h-[380px]">
             <PortfolioHeatmap />
          </div>
        </div>
      </div>

      {/* 5. Holdings Table */}
      <HoldingsTable />

      {/* 6. Bottom Widgets */}
      <BottomWidgets />
    </div>
  )
}
