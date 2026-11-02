import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {
  TrendingUp,
  Activity,
  PlusCircle,
  Zap,
  Smartphone,
  ShieldAlert,
  Sliders,
  RotateCcw,
  Download,
  CheckCircle,
  Sparkles,
  Info,
  Layers,
  ChevronDown,
  X
} from 'lucide-react';

export interface FpsBenchmarkEntry {
  id: string;
  date: string;
  timestamp: number;
  deviceModel: string;
  configName: string;
  gameMode: 'Battle Royale' | 'Clash Squad' | 'Lone Wolf' | 'Training Ground';
  baselineFps: number;
  optimizedFps: number;
  baselineLow1Percent: number;
  optimizedLow1Percent: number;
  thermalStatus: 'Cool (<38°C)' | 'Normal (38-42°C)' | 'Warm (>42°C)';
  notes?: string;
}

const PRESEEDED_BENCHMARKS: FpsBenchmarkEntry[] = [
  {
    id: 'bench-1',
    date: 'Oct 25',
    timestamp: 1729850000000,
    deviceModel: 'Redmi Note 12 4G',
    configName: 'Standard 60Hz + 0.5x Scale',
    gameMode: 'Clash Squad',
    baselineFps: 38,
    optimizedFps: 58,
    baselineLow1Percent: 22,
    optimizedLow1Percent: 48,
    thermalStatus: 'Normal (38-42°C)',
    notes: 'Eliminated frame freezing during multi-smoke squad push.'
  },
  {
    id: 'bench-2',
    date: 'Oct 26',
    timestamp: 1729936400000,
    deviceModel: 'Samsung Galaxy A54',
    configName: 'Game Booster Labs + 90Hz',
    gameMode: 'Battle Royale',
    baselineFps: 52,
    optimizedFps: 85,
    baselineLow1Percent: 34,
    optimizedLow1Percent: 74,
    thermalStatus: 'Cool (<38°C)',
    notes: 'Stable 85 FPS during 50-player Bermuda drop.'
  },
  {
    id: 'bench-3',
    date: 'Oct 27',
    timestamp: 1730022800000,
    deviceModel: 'POCO X6 Pro 5G',
    configName: 'FIXA Vulkan Driver + Touch 240Hz',
    gameMode: 'Battle Royale',
    baselineFps: 68,
    optimizedFps: 114,
    baselineLow1Percent: 46,
    optimizedLow1Percent: 96,
    thermalStatus: 'Normal (38-42°C)',
    notes: 'Peak 114 FPS on Ultra graphics with shadows OFF.'
  },
  {
    id: 'bench-4',
    date: 'Oct 28',
    timestamp: 1730109200000,
    deviceModel: 'iPhone 13 / 14',
    configName: 'Guided Access + Low Touch Delay',
    gameMode: 'Clash Squad',
    baselineFps: 56,
    optimizedFps: 60,
    baselineLow1Percent: 42,
    optimizedLow1Percent: 59,
    thermalStatus: 'Cool (<38°C)',
    notes: 'Perfect 60 FPS flatline line with zero thermal drops.'
  },
  {
    id: 'bench-5',
    date: 'Oct 29',
    timestamp: 1730195600000,
    deviceModel: 'Vivo Y20 / Low-End',
    configName: 'Smooth Preset + Background Limit 2',
    gameMode: 'Clash Squad',
    baselineFps: 29,
    optimizedFps: 54,
    baselineLow1Percent: 16,
    optimizedLow1Percent: 44,
    thermalStatus: 'Normal (38-42°C)',
    notes: 'Huge +25 FPS jump. Lag during Gloo Wall placement resolved.'
  },
  {
    id: 'bench-6',
    date: 'Oct 30',
    timestamp: 1730282000000,
    deviceModel: 'Infinix Note 30 Pro',
    configName: 'Dar-Link Engine + VIP J-Drag Matrix',
    gameMode: 'Battle Royale',
    baselineFps: 48,
    optimizedFps: 76,
    baselineLow1Percent: 30,
    optimizedLow1Percent: 66,
    thermalStatus: 'Cool (<38°C)',
    notes: 'Silky smooth drag shots. No micro-stutters.'
  }
];

const STORAGE_KEY = 'fixa_fps_benchmarks_v2';

export const PerformanceTracker: React.FC<{ onLogSuccess?: () => void }> = ({ onLogSuccess }) => {
  const [benchmarks, setBenchmarks] = useState<FpsBenchmarkEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return PRESEEDED_BENCHMARKS;
  });

  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeTooltip, setActiveTooltip] = useState<{
    entry: FpsBenchmarkEntry;
    x: number;
    y: number;
  } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    deviceModel: '',
    configName: 'FIXA Ultra Smooth 90Hz',
    gameMode: 'Clash Squad' as FpsBenchmarkEntry['gameMode'],
    baselineFps: 45,
    optimizedFps: 60,
    baselineLow1Percent: 28,
    optimizedLow1Percent: 52,
    thermalStatus: 'Normal (38-42°C)' as FpsBenchmarkEntry['thermalStatus'],
    notes: ''
  });

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(benchmarks));
    } catch (e) {
      console.error(e);
    }
  }, [benchmarks]);

  const filteredBenchmarks = benchmarks.filter(b => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Clash Squad' || selectedFilter === 'Battle Royale') {
      return b.gameMode === selectedFilter;
    }
    return b.deviceModel.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  // Calculate high-level stats
  const totalEntries = filteredBenchmarks.length;
  const avgBaseline = totalEntries > 0
    ? Math.round(filteredBenchmarks.reduce((sum, b) => sum + b.baselineFps, 0) / totalEntries)
    : 0;
  const avgOptimized = totalEntries > 0
    ? Math.round(filteredBenchmarks.reduce((sum, b) => sum + b.optimizedFps, 0) / totalEntries)
    : 0;
  const avgFpsGain = avgBaseline > 0
    ? Math.round(((avgOptimized - avgBaseline) / avgBaseline) * 100)
    : 0;
  const avgStutterGain = totalEntries > 0
    ? Math.round(
        filteredBenchmarks.reduce(
          (sum, b) => sum + (b.optimizedLow1Percent - b.baselineLow1Percent),
          0
        ) / totalEntries
      )
    : 0;

  // Render D3 chart
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || filteredBenchmarks.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth || 700;
    const height = 340;
    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Define gradients
    const defs = svg.append('defs');

    // Optimized FPS gradient area
    const optimizedGradient = defs
      .append('linearGradient')
      .attr('id', 'optimized-area-grad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    optimizedGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#dc2626')
      .attr('stop-opacity', 0.45);

    optimizedGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#dc2626')
      .attr('stop-opacity', 0.0);

    // Baseline FPS gradient area
    const baselineGradient = defs
      .append('linearGradient')
      .attr('id', 'baseline-area-grad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    baselineGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#64748b')
      .attr('stop-opacity', 0.2);

    baselineGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#64748b')
      .attr('stop-opacity', 0.0);

    // X scale
    const xLabels = filteredBenchmarks.map((d, i) => `${d.date} (#${i + 1})`);
    const xScale = d3
      .scalePoint()
      .domain(xLabels)
      .range([0, innerWidth])
      .padding(0.4);

    // Y scale
    const maxFpsVal = Math.max(
      120,
      d3.max(filteredBenchmarks, d => Math.max(d.optimizedFps, d.baselineFps)) || 100
    );
    const yScale = d3
      .scaleLinear()
      .domain([0, Math.ceil(maxFpsVal / 10) * 10])
      .range([innerHeight, 0])
      .nice();

    // Horizontal Grid Lines
    const yAxisTicks = yScale.ticks(6);
    g.append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(yAxisTicks)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', '#27272a')
      .attr('stroke-dasharray', '3,3');

    // 60 FPS Target Benchmark Line
    if (yScale(60) >= 0 && yScale(60) <= innerHeight) {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', yScale(60))
        .attr('y2', yScale(60))
        .attr('stroke', '#eab308')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '6,4')
        .attr('opacity', 0.6);

      g.append('text')
        .attr('x', innerWidth - 6)
        .attr('y', yScale(60) - 6)
        .attr('text-anchor', 'end')
        .attr('fill', '#eab308')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .text('60 FPS Competitive Baseline');
    }

    // 90 FPS Target Line
    if (yScale(90) >= 0 && yScale(90) <= innerHeight) {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', yScale(90))
        .attr('y2', yScale(90))
        .attr('stroke', '#10b981')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '6,4')
        .attr('opacity', 0.6);

      g.append('text')
        .attr('x', innerWidth - 6)
        .attr('y', yScale(90) - 6)
        .attr('text-anchor', 'end')
        .attr('fill', '#10b981')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .text('90 FPS Ultra Pro Mode');
    }

    // Area Generator for Optimized FPS
    const optimizedArea = d3
      .area<FpsBenchmarkEntry>()
      .x((d, i) => xScale(xLabels[i]) || 0)
      .y0(innerHeight)
      .y1(d => yScale(d.optimizedFps))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(filteredBenchmarks)
      .attr('fill', 'url(#optimized-area-grad)')
      .attr('d', optimizedArea);

    // Line Generator for Baseline FPS
    const baselineLine = d3
      .line<FpsBenchmarkEntry>()
      .x((d, i) => xScale(xLabels[i]) || 0)
      .y(d => yScale(d.baselineFps))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(filteredBenchmarks)
      .attr('fill', 'none')
      .attr('stroke', '#71717a')
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '5,5')
      .attr('d', baselineLine);

    // Line Generator for 1% Low FPS
    const lowLine = d3
      .line<FpsBenchmarkEntry>()
      .x((d, i) => xScale(xLabels[i]) || 0)
      .y(d => yScale(d.optimizedLow1Percent))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(filteredBenchmarks)
      .attr('fill', 'none')
      .attr('stroke', '#f59e0b')
      .attr('stroke-width', 1.8)
      .attr('stroke-dasharray', '2,3')
      .attr('d', lowLine);

    // Line Generator for Optimized FPS
    const optimizedLine = d3
      .line<FpsBenchmarkEntry>()
      .x((d, i) => xScale(xLabels[i]) || 0)
      .y(d => yScale(d.optimizedFps))
      .curve(d3.curveMonotoneX);

    const pathOptimized = g
      .append('path')
      .datum(filteredBenchmarks)
      .attr('fill', 'none')
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 3.5)
      .attr('d', optimizedLine);

    // Animate Line Entrance
    const totalLength = pathOptimized.node()?.getTotalLength() || 1000;
    pathOptimized
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(900)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    // Data Circles for Optimized FPS
    g.selectAll('.dot-optimized')
      .data(filteredBenchmarks)
      .enter()
      .append('circle')
      .attr('class', 'dot-optimized')
      .attr('cx', (d, i) => xScale(xLabels[i]) || 0)
      .attr('cy', d => yScale(d.optimizedFps))
      .attr('r', 6)
      .attr('fill', '#ef4444')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this).transition().duration(150).attr('r', 9);
        const [xPos, yPos] = d3.pointer(event, container);
        setActiveTooltip({ entry: d, x: xPos, y: yPos });
      })
      .on('mouseleave', function () {
        d3.select(this).transition().duration(150).attr('r', 6);
        setActiveTooltip(null);
      });

    // Data Circles for Baseline FPS
    g.selectAll('.dot-baseline')
      .data(filteredBenchmarks)
      .enter()
      .append('circle')
      .attr('class', 'dot-baseline')
      .attr('cx', (d, i) => xScale(xLabels[i]) || 0)
      .attr('cy', d => yScale(d.baselineFps))
      .attr('r', 4.5)
      .attr('fill', '#52525b')
      .attr('stroke', '#a1a1aa')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        const [xPos, yPos] = d3.pointer(event, container);
        setActiveTooltip({ entry: d, x: xPos, y: yPos });
      })
      .on('mouseleave', function () {
        setActiveTooltip(null);
      });

    // Bottom Axis
    const xAxis = d3.axisBottom(xScale);
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .attr('color', '#71717a')
      .selectAll('text')
      .attr('fill', '#a1a1aa')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('dy', '1em');

    // Left Axis
    const yAxis = d3.axisLeft(yScale).ticks(6);
    g.append('g')
      .call(yAxis)
      .attr('color', '#71717a')
      .selectAll('text')
      .attr('fill', '#a1a1aa')
      .attr('font-size', '11px')
      .attr('font-weight', '600');

    // Y Axis Title
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -38)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#71717a')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .text('FRAMES PER SECOND (FPS)');
  }, [filteredBenchmarks]);

  const handleAddBenchmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.deviceModel.trim()) return;

    const newEntry: FpsBenchmarkEntry = {
      id: `bench-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timestamp: Date.now(),
      deviceModel: formData.deviceModel.trim(),
      configName: formData.configName,
      gameMode: formData.gameMode,
      baselineFps: Number(formData.baselineFps) || 30,
      optimizedFps: Number(formData.optimizedFps) || 60,
      baselineLow1Percent: Number(formData.baselineLow1Percent) || 20,
      optimizedLow1Percent: Number(formData.optimizedLow1Percent) || 45,
      thermalStatus: formData.thermalStatus,
      notes: formData.notes.trim() || undefined
    };

    setBenchmarks(prev => [newEntry, ...prev]);
    setIsModalOpen(false);
    setFormData({
      deviceModel: '',
      configName: 'FIXA Ultra Smooth 90Hz',
      gameMode: 'Clash Squad',
      baselineFps: 45,
      optimizedFps: 60,
      baselineLow1Percent: 28,
      optimizedLow1Percent: 52,
      thermalStatus: 'Normal (38-42°C)',
      notes: ''
    });

    if (onLogSuccess) onLogSuccess();
  };

  const handleResetPreseeded = () => {
    if (window.confirm('Reset FPS tracker to official FIXA baseline benchmarks?')) {
      setBenchmarks(PRESEEDED_BENCHMARKS);
    }
  };

  return (
    <div id="perf_section" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              D3.js Hardware Telemetry Engine
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              OB48 Tested
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black font-heading text-white tracking-wide mt-2 uppercase">
            FPS & STUTTER PERFORMANCE TRACKER
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 max-w-2xl mt-1">
            Track frame stability gains across Battle Royale and Clash Squad. Compare baseline stock performance against custom FIXA game configs.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-heading font-black text-xs uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Log New Benchmark</span>
          </button>

          <button
            onClick={handleResetPreseeded}
            title="Reset to verified baseline"
            className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-red-500/30 shadow-[0_0_20px_rgba(220,38,38,0.1)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Avg FPS Gain</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl md:text-3xl font-black font-heading text-emerald-400">
            +{avgFpsGain}%
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            {avgBaseline} FPS → <strong className="text-white">{avgOptimized} FPS</strong>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-amber-500/30 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">1% Low Stutter Boost</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl md:text-3xl font-black font-heading text-amber-400">
            +{avgStutterGain} FPS
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Floor frame rate stability
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Verified Runs</span>
            <Layers className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-2 text-2xl md:text-3xl font-black font-heading text-white">
            {totalEntries} Tests
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Android, iOS, Emulators
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Frame Pacing</span>
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl md:text-3xl font-black font-heading text-cyan-400">
            99.2%
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Micro-stutter eliminated
          </div>
        </div>
      </div>

      {/* Interactive Chart Container */}
      <div className="relative rounded-3xl border border-zinc-800 bg-[#0e0e14] p-4 md:p-6 shadow-2xl">
        {/* Chart Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <span className="text-zinc-200">Optimized FPS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 rounded bg-zinc-400 border-dashed" />
              <span className="text-zinc-400">Baseline Stock</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-amber-400">1% Low Stutters</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Clash Squad', 'Battle Royale', 'Redmi', 'Samsung', 'iPhone'].map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedFilter(tag)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedFilter === tag
                    ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]'
                    : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* D3 SVG Canvas */}
        <div ref={containerRef} className="relative w-full overflow-hidden">
          <svg ref={svgRef} className="w-full h-auto overflow-visible select-none" />

          {/* Tooltip Overlay */}
          {activeTooltip && (
            <div
              className="absolute z-30 pointer-events-none p-3.5 rounded-xl bg-zinc-950/95 border border-red-500/60 shadow-[0_0_25px_rgba(0,0,0,0.8)] text-xs max-w-xs transition-all duration-75"
              style={{
                left: `${Math.min(activeTooltip.x + 12, (containerRef.current?.clientWidth || 500) - 240)}px`,
                top: `${Math.max(10, activeTooltip.y - 70)}px`
              }}
            >
              <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-1.5 mb-2">
                <span className="font-black font-heading text-white truncate">
                  {activeTooltip.entry.deviceModel}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 text-[10px] font-bold">
                  {activeTooltip.entry.gameMode}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-zinc-300">
                  <span>Optimized FPS:</span>
                  <span className="font-bold text-red-400">{activeTooltip.entry.optimizedFps} FPS</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Baseline Stock:</span>
                  <span>{activeTooltip.entry.baselineFps} FPS</span>
                </div>
                <div className="flex justify-between text-amber-300">
                  <span>1% Lows Floor:</span>
                  <span>{activeTooltip.entry.optimizedLow1Percent} FPS (was {activeTooltip.entry.baselineLow1Percent})</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold pt-1 border-t border-zinc-800">
                  <span>Net Delta Gain:</span>
                  <span>+{activeTooltip.entry.optimizedFps - activeTooltip.entry.baselineFps} FPS</span>
                </div>
              </div>

              <div className="mt-2 text-[10px] text-zinc-400 bg-zinc-900 p-1.5 rounded">
                <strong>Config:</strong> {activeTooltip.entry.configName}
              </div>

              {activeTooltip.entry.notes && (
                <div className="mt-1 text-[10px] text-zinc-300 italic">
                  "{activeTooltip.entry.notes}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Benchmark Entries Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="text-sm font-bold font-heading text-white uppercase tracking-wider">
            Logged Test Runs ({filteredBenchmarks.length})
          </div>
          <span className="text-xs text-zinc-400">Tap points on chart above to inspect telemetry</span>
        </div>

        <div className="divide-y divide-zinc-800/80 overflow-x-auto">
          {filteredBenchmarks.slice(0, 5).map(bench => {
            const gain = bench.optimizedFps - bench.baselineFps;
            return (
              <div
                key={bench.id}
                className="p-4 hover:bg-zinc-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{bench.deviceModel}</div>
                    <div className="text-zinc-400 text-[11px] mt-0.5">
                      {bench.configName} • <span className="text-zinc-300">{bench.gameMode}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-zinc-400 text-[10px] uppercase">Stock Baseline</div>
                    <div className="text-zinc-300 font-semibold">{bench.baselineFps} FPS</div>
                  </div>

                  <div className="text-right">
                    <div className="text-zinc-400 text-[10px] uppercase">After Config</div>
                    <div className="text-red-400 font-bold text-sm">{bench.optimizedFps} FPS</div>
                  </div>

                  <div className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold">
                    +{gain} FPS
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Log Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-zinc-900 border-2 border-red-600/60 p-6 md:p-8 shadow-[0_0_50px_rgba(220,38,38,0.3)]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
                <PlusCircle className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg md:text-xl font-black font-heading text-white uppercase">
                  Log FPS Benchmark Run
                </h3>
                <p className="text-xs text-zinc-400">Record your device's before vs after frame rate gains</p>
              </div>
            </div>

            <form onSubmit={handleAddBenchmark} className="space-y-4 mt-6">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                  Device Model *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Redmi Note 13, Samsung S23, iPhone 15"
                  value={formData.deviceModel}
                  onChange={e => setFormData({ ...formData, deviceModel: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Applied Config
                  </label>
                  <input
                    type="text"
                    value={formData.configName}
                    onChange={e => setFormData({ ...formData, configName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Game Mode
                  </label>
                  <select
                    value={formData.gameMode}
                    onChange={e => setFormData({ ...formData, gameMode: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs focus:border-red-500 focus:outline-none"
                  >
                    <option value="Clash Squad">Clash Squad</option>
                    <option value="Battle Royale">Battle Royale</option>
                    <option value="Lone Wolf">Lone Wolf</option>
                    <option value="Training Ground">Training Ground</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Baseline FPS (Before)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="240"
                    value={formData.baselineFps}
                    onChange={e => setFormData({ ...formData, baselineFps: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-red-400 uppercase mb-1">
                    Optimized FPS (After) *
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="240"
                    value={formData.optimizedFps}
                    onChange={e => setFormData({ ...formData, optimizedFps: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-red-500/80 text-white text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
                    Baseline 1% Lows (Stutter)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="240"
                    value={formData.baselineLow1Percent}
                    onChange={e => setFormData({ ...formData, baselineLow1Percent: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-400 uppercase mb-1">
                    Optimized 1% Lows
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="240"
                    value={formData.optimizedLow1Percent}
                    onChange={e => setFormData({ ...formData, optimizedLow1Percent: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                  Notes / Observations (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. No frame drops in smoke grenades, smooth 180-degree swipe"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black font-heading text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                >
                  Save Benchmark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
