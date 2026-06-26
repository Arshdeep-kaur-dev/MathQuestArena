import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import useWindowSize from "../hooks/useWindowSize";

// ============================================================
// INLINE DIAGRAMS — Chapter 4 ke liye
// ============================================================

const DiagramPoint = () => (
  <div style={diagStyles.inlineContainer}>
    <svg width="200" height="80" viewBox="0 0 200 80">
      <circle cx="100" cy="40" r="6" fill="#1e1b4b" />
      <text x="112" y="45" fontSize="16" fill="#1e1b4b" fontWeight="bold">
        A
      </text>
      <text x="60" y="72" fontSize="12" fill="#666">
        • A point is just a dot!
      </text>
    </svg>
  </div>
);

const DiagramLines = () => (
  <div style={diagStyles.inlineContainer}>
    <svg width="700" height="120" viewBox="0 0 700 120">
      {/* Line Segment */}
      <text x="60" y="18" fontSize="13" fill="#4f46e5" fontWeight="700">
        Line Segment AB
      </text>
      <line
        x1="40"
        y1="40"
        x2="200"
        y2="40"
        stroke="#1e1b4b"
        strokeWidth="2.5"
      />
      <circle cx="40" cy="40" r="4" fill="#1e1b4b" />
      <circle cx="200" cy="40" r="4" fill="#1e1b4b" />
      <text x="30" y="28" fontSize="13" fill="#1e1b4b" fontWeight="bold">
        A
      </text>
      <text x="196" y="28" fontSize="13" fill="#1e1b4b" fontWeight="bold">
        B
      </text>
      <text x="40" y="62" fontSize="11" fill="#666">
        2 endpoints, finite length
      </text>

      {/* Line */}
      <text x="290" y="18" fontSize="13" fill="#4f46e5" fontWeight="700">
        Line PQ
      </text>
      <line
        x1="250"
        y1="40"
        x2="420"
        y2="40"
        stroke="#1e1b4b"
        strokeWidth="2.5"
      />
      <polygon points="244,40 258,34 258,46" fill="#1e1b4b" />
      <polygon points="426,40 412,34 412,46" fill="#1e1b4b" />
      <text x="300" y="28" fontSize="13" fill="#1e1b4b" fontWeight="bold">
        P
      </text>
      <text x="355" y="28" fontSize="13" fill="#1e1b4b" fontWeight="bold">
        Q
      </text>
      <text x="258" y="62" fontSize="11" fill="#666">
        No endpoints, infinite both sides
      </text>

      {/* Ray */}
      <text x="490" y="18" fontSize="13" fill="#4f46e5" fontWeight="700">
        Ray PQ
      </text>
      <line
        x1="460"
        y1="40"
        x2="620"
        y2="40"
        stroke="#1e1b4b"
        strokeWidth="2.5"
      />
      <circle cx="460" cy="40" r="4" fill="#1e1b4b" />
      <polygon points="628,40 614,34 614,46" fill="#1e1b4b" />
      <text x="452" y="28" fontSize="13" fill="#1e1b4b" fontWeight="bold">
        P
      </text>
      <text x="616" y="28" fontSize="13" fill="#1e1b4b" fontWeight="bold">
        Q
      </text>
      <text x="460" y="62" fontSize="11" fill="#666">
        1 endpoint, infinite one side
      </text>
    </svg>
  </div>
);

const DiagramLineTypes = () => (
  <div style={diagStyles.inlineContainer}>
    <svg width="600" height="110" viewBox="0 0 600 110">
      {/* Parallel */}
      <text x="30" y="18" fontSize="13" fill="#4f46e5" fontWeight="700">
        Parallel Lines
      </text>
      <line
        x1="20"
        y1="38"
        x2="160"
        y2="38"
        stroke="#4f46e5"
        strokeWidth="2.5"
      />
      <line
        x1="20"
        y1="62"
        x2="160"
        y2="62"
        stroke="#4f46e5"
        strokeWidth="2.5"
      />
      <polygon points="14,38 26,33 26,43" fill="#4f46e5" />
      <polygon points="166,38 152,33 152,43" fill="#4f46e5" />
      <polygon points="14,62 26,57 26,67" fill="#4f46e5" />
      <polygon points="166,62 152,57 152,67" fill="#4f46e5" />
      <text x="40" y="88" fontSize="11" fill="#666">
        Never meet (∥)
      </text>

      {/* Intersecting */}
      <text x="220" y="18" fontSize="13" fill="#e53e3e" fontWeight="700">
        Intersecting Lines
      </text>
      <line
        x1="210"
        y1="30"
        x2="360"
        y2="90"
        stroke="#e53e3e"
        strokeWidth="2.5"
      />
      <line
        x1="360"
        y1="30"
        x2="210"
        y2="90"
        stroke="#e53e3e"
        strokeWidth="2.5"
      />
      <circle cx="285" cy="60" r="5" fill="#1e1b4b" />
      <text x="290" y="56" fontSize="11" fill="#1e1b4b" fontWeight="bold">
        P
      </text>
      <text x="230" y="105" fontSize="11" fill="#666">
        Meet at one point
      </text>

      {/* Perpendicular */}
      <text x="420" y="18" fontSize="13" fill="#166534" fontWeight="700">
        Perpendicular Lines
      </text>
      <line
        x1="400"
        y1="60"
        x2="570"
        y2="60"
        stroke="#166534"
        strokeWidth="2.5"
      />
      <line
        x1="485"
        y1="20"
        x2="485"
        y2="100"
        stroke="#166534"
        strokeWidth="2.5"
      />
      <rect
        x="485"
        y="60"
        width="10"
        height="10"
        fill="none"
        stroke="#166534"
        strokeWidth="2"
      />
      <text x="430" y="105" fontSize="11" fill="#666">
        Meet at 90° (⊥)
      </text>
    </svg>
  </div>
);

const DiagramCurves = () => (
  <div style={diagStyles.inlineContainer}>
    <svg width="500" height="120" viewBox="0 0 500 120">
      {/* Open Curve */}
      <text x="40" y="18" fontSize="13" fill="#4f46e5" fontWeight="700">
        Open Curve
      </text>
      <path
        d="M 20 75 C 40 30, 80 90, 130 60"
        stroke="#4f46e5"
        strokeWidth="2.5"
        fill="none"
      />
      <circle cx="20" cy="75" r="4" fill="#4f46e5" />
      <circle cx="130" cy="60" r="4" fill="#4f46e5" />
      <text x="20" y="105" fontSize="11" fill="#666">
        Start ≠ End point
      </text>

      {/* Closed Curve */}
      <text x="210" y="18" fontSize="13" fill="#166534" fontWeight="700">
        Closed Curve
      </text>
      <ellipse
        cx="270"
        cy="68"
        rx="60"
        ry="35"
        stroke="#166534"
        strokeWidth="2.5"
        fill="none"
      />
      <text x="210" y="105" fontSize="11" fill="#666">
        Start = End point
      </text>

      {/* Examples */}
      <text x="390" y="18" fontSize="13" fill="#b45309" fontWeight="700">
        Examples:
      </text>
      <text x="390" y="40" fontSize="12" fill="#b45309">
        ✔ Triangle
      </text>
      <text x="390" y="58" fontSize="12" fill="#b45309">
        ✔ Circle
      </text>
      <text x="390" y="76" fontSize="12" fill="#b45309">
        ✔ Square
      </text>
      <text x="390" y="94" fontSize="12" fill="#b45309">
        are closed!
      </text>
    </svg>
  </div>
);

const DiagramAngles = () => (
  <div style={diagStyles.inlineContainer}>
    <svg width="600" height="110" viewBox="0 0 600 110">
      {/* Acute */}
      <text x="20" y="15" fontSize="12" fill="#4f46e5" fontWeight="700">
        Acute ({"<"}90°)
      </text>
      <line x1="20" y1="85" x2="110" y2="85" stroke="#1e1b4b" strokeWidth="2" />
      <line x1="20" y1="85" x2="65" y2="30" stroke="#1e1b4b" strokeWidth="2" />
      <path
        d="M 45 85 A 25 25 0 0 0 33 62"
        stroke="#e53e3e"
        strokeWidth="1.5"
        fill="none"
      />
      <text x="46" y="78" fontSize="10" fill="#e53e3e">
        45°
      </text>
      <circle cx="20" cy="85" r="3" fill="#e53e3e" />

      {/* Right */}
      <text x="148" y="15" fontSize="12" fill="#4f46e5" fontWeight="700">
        Right (90°)
      </text>
      <line
        x1="140"
        y1="85"
        x2="240"
        y2="85"
        stroke="#1e1b4b"
        strokeWidth="2"
      />
      <line
        x1="140"
        y1="85"
        x2="140"
        y2="25"
        stroke="#1e1b4b"
        strokeWidth="2"
      />
      <rect
        x="140"
        y="75"
        width="10"
        height="10"
        fill="none"
        stroke="#e53e3e"
        strokeWidth="2"
      />
      <text x="152" y="70" fontSize="10" fill="#e53e3e">
        90°
      </text>
      <circle cx="140" cy="85" r="3" fill="#e53e3e" />

      {/* Obtuse */}
      <text x="272" y="15" fontSize="12" fill="#4f46e5" fontWeight="700">
        Obtuse (90°-180°)
      </text>
      <line
        x1="270"
        y1="85"
        x2="390"
        y2="85"
        stroke="#1e1b4b"
        strokeWidth="2"
      />
      <line
        x1="270"
        y1="85"
        x2="310"
        y2="30"
        stroke="#1e1b4b"
        strokeWidth="2"
      />
      <path
        d="M 305 85 A 35 35 0 0 0 283 58"
        stroke="#e53e3e"
        strokeWidth="1.5"
        fill="none"
      />
      <text x="298" y="75" fontSize="10" fill="#e53e3e">
        120°
      </text>
      <circle cx="270" cy="85" r="3" fill="#e53e3e" />

      {/* Straight */}
      <text x="415" y="15" fontSize="12" fill="#4f46e5" fontWeight="700">
        Straight (180°)
      </text>
      <line
        x1="410"
        y1="65"
        x2="580"
        y2="65"
        stroke="#1e1b4b"
        strokeWidth="2"
      />
      <polygon points="404,65 418,59 418,71" fill="#1e1b4b" />
      <polygon points="586,65 572,59 572,71" fill="#1e1b4b" />
      <text x="465" y="55" fontSize="10" fill="#e53e3e">
        180°
      </text>
    </svg>
  </div>
);

const DiagramTriangles = () => (
  <div style={diagStyles.inlineContainer}>
    <svg width="550" height="110" viewBox="0 0 550 110">
      {/* Equilateral */}
      <text x="20" y="15" fontSize="12" fill="#4f46e5" fontWeight="700">
        Equilateral
      </text>
      <polygon
        points="75,20 20,100 130,100"
        fill="#c6f6d5"
        stroke="#276749"
        strokeWidth="2"
      />
      <text x="30" y="95" fontSize="9" fill="#276749">
        All sides equal
      </text>
      <text x="28" y="107" fontSize="9" fill="#276749">
        All angles 60°
      </text>

      {/* Isosceles */}
      <text x="175" y="15" fontSize="12" fill="#4f46e5" fontWeight="700">
        Isosceles
      </text>
      <polygon
        points="220,20 175,100 265,100"
        fill="#bee3f8"
        stroke="#2b6cb0"
        strokeWidth="2"
      />
      <text x="168" y="95" fontSize="9" fill="#2b6cb0">
        2 sides equal
      </text>
      <text x="168" y="107" fontSize="9" fill="#2b6cb0">
        2 angles equal
      </text>

      {/* Scalene */}
      <text x="310" y="15" fontSize="12" fill="#4f46e5" fontWeight="700">
        Scalene
      </text>
      <polygon
        points="330,20 295,100 410,100"
        fill="#fbd38d"
        stroke="#c05621"
        strokeWidth="2"
      />
      <text x="295" y="95" fontSize="9" fill="#c05621">
        No equal sides
      </text>
      <text x="295" y="107" fontSize="9" fill="#c05621">
        No equal angles
      </text>

      {/* Right */}
      <text x="440" y="15" fontSize="12" fill="#4f46e5" fontWeight="700">
        Right
      </text>
      <polygon
        points="430,100 430,25 510,100"
        fill="#fed7d7"
        stroke="#c53030"
        strokeWidth="2"
      />
      <rect
        x="430"
        y="90"
        width="10"
        height="10"
        fill="none"
        stroke="#c53030"
        strokeWidth="2"
      />
      <text x="432" y="95" fontSize="8" fill="#c53030">
        90°
      </text>
    </svg>
  </div>
);

const DiagramQuadrilaterals = () => (
  <div style={diagStyles.inlineContainer}>
    <svg width="580" height="110" viewBox="0 0 580 110">
      {/* Square */}
      <text x="15" y="15" fontSize="11" fill="#4f46e5" fontWeight="700">
        Square
      </text>
      <rect
        x="15"
        y="25"
        width="65"
        height="65"
        fill="#c6f6d5"
        stroke="#276749"
        strokeWidth="2"
      />
      <text x="18" y="105" fontSize="9" fill="#276749">
        All sides=, all 90°
      </text>

      {/* Rectangle */}
      <text x="103" y="15" fontSize="11" fill="#4f46e5" fontWeight="700">
        Rectangle
      </text>
      <rect
        x="100"
        y="35"
        width="95"
        height="50"
        fill="#bee3f8"
        stroke="#2b6cb0"
        strokeWidth="2"
      />
      <text x="103" y="105" fontSize="9" fill="#2b6cb0">
        Opp sides=, all 90°
      </text>

      {/* Parallelogram */}
      <text x="212" y="15" fontSize="11" fill="#4f46e5" fontWeight="700">
        Parallelogram
      </text>
      <polygon
        points="225,35 305,35 295,85 215,85"
        fill="#fbd38d"
        stroke="#c05621"
        strokeWidth="2"
      />
      <text x="212" y="105" fontSize="9" fill="#c05621">
        Opp sides parallel=
      </text>

      {/* Rhombus */}
      <text x="325" y="15" fontSize="11" fill="#4f46e5" fontWeight="700">
        Rhombus
      </text>
      <polygon
        points="365,22 400,58 365,94 330,58"
        fill="#e9d8fd"
        stroke="#553c9a"
        strokeWidth="2"
      />
      <text x="325" y="108" fontSize="9" fill="#553c9a">
        All sides=, opp angles=
      </text>

      {/* Trapezium */}
      <text x="425" y="15" fontSize="11" fill="#4f46e5" fontWeight="700">
        Trapezium
      </text>
      <polygon
        points="435,35 530,35 550,85 415,85"
        fill="#fed7d7"
        stroke="#c53030"
        strokeWidth="2"
      />
      <text x="425" y="105" fontSize="9" fill="#c53030">
        1 pair parallel sides
      </text>
    </svg>
  </div>
);

const DiagramCircle = () => (
  <div style={diagStyles.inlineContainer}>
    <svg width="400" height="160" viewBox="0 0 400 160">
      <circle
        cx="200"
        cy="80"
        r="70"
        stroke="#1e1b4b"
        strokeWidth="2.5"
        fill="#eef2ff"
      />
      {/* Center */}
      <circle cx="200" cy="80" r="5" fill="#e53e3e" />
      <text x="207" y="76" fontSize="12" fill="#e53e3e" fontWeight="bold">
        O (Centre)
      </text>
      {/* Radius */}
      <line
        x1="200"
        y1="80"
        x2="270"
        y2="80"
        stroke="#4f46e5"
        strokeWidth="2"
      />
      <text x="225" y="70" fontSize="11" fill="#4f46e5" fontWeight="600">
        Radius
      </text>
      {/* Diameter */}
      <line
        x1="130"
        y1="80"
        x2="270"
        y2="80"
        stroke="#e53e3e"
        strokeWidth="1.5"
        strokeDasharray="5"
      />
      <text x="155" y="100" fontSize="11" fill="#e53e3e" fontWeight="600">
        Diameter = 2 × Radius
      </text>
      {/* Chord */}
      <line
        x1="145"
        y1="40"
        x2="255"
        y2="120"
        stroke="#166534"
        strokeWidth="2"
      />
      <text x="258" y="118" fontSize="11" fill="#166534" fontWeight="600">
        Chord
      </text>
      {/* Arc label */}
      <text
        x="200"
        y="155"
        fontSize="11"
        fill="#b45309"
        fontWeight="600"
        textAnchor="middle"
      >
        Arc = part of circumference
      </text>
    </svg>
  </div>
);

const DiagramFraction = () => (
  <div style={diagStyles.inlineContainer}>
    <svg width="500" height="120" viewBox="0 0 500 120">
      {/* 3/5 fraction */}
      <text x="20" y="18" fontSize="13" fill="#4f46e5" fontWeight="700">
        3/5 (3 shaded out of 5)
      </text>
      <rect
        x="20"
        y="28"
        width="50"
        height="50"
        fill="#4f46e5"
        stroke="#1e1b4b"
        strokeWidth="1.5"
      />
      <rect
        x="72"
        y="28"
        width="50"
        height="50"
        fill="#4f46e5"
        stroke="#1e1b4b"
        strokeWidth="1.5"
      />
      <rect
        x="124"
        y="28"
        width="50"
        height="50"
        fill="#4f46e5"
        stroke="#1e1b4b"
        strokeWidth="1.5"
      />
      <rect
        x="176"
        y="28"
        width="50"
        height="50"
        fill="white"
        stroke="#1e1b4b"
        strokeWidth="1.5"
      />
      <rect
        x="228"
        y="28"
        width="50"
        height="50"
        fill="white"
        stroke="#1e1b4b"
        strokeWidth="1.5"
      />
      <text x="55" y="108" fontSize="11" fill="#4f46e5" fontWeight="600">
        Shaded = 3
      </text>
      <text x="185" y="108" fontSize="11" fill="#666">
        Unshaded = 2
      </text>
      <text x="20" y="118" fontSize="10" fill="#888">
        Total parts = 5 → Fraction = 3/5
      </text>

      {/* 1/2 fraction */}
      <text x="320" y="18" fontSize="13" fill="#166534" fontWeight="700">
        1/2 (half)
      </text>
      <rect
        x="320"
        y="28"
        width="70"
        height="50"
        fill="#c6f6d5"
        stroke="#276749"
        strokeWidth="1.5"
      />
      <rect
        x="392"
        y="28"
        width="70"
        height="50"
        fill="white"
        stroke="#276749"
        strokeWidth="1.5"
      />
      <text x="330" y="108" fontSize="11" fill="#166534">
        1 shaded out of 2 = 1/2
      </text>
    </svg>
  </div>
);

const DiagramDecimalPlace = () => (
  <div style={diagStyles.inlineContainer}>
    <svg width="700" height="160" viewBox="0 0 700 160">
      {/* Headers */}
      <rect x="10" y="10" width="90" height="35" fill="#4f46e5" rx="5" />
      <rect x="102" y="10" width="90" height="35" fill="#4f46e5" rx="5" />
      <rect x="194" y="10" width="90" height="35" fill="#4f46e5" rx="5" />
      {/* Decimal point */}
      <rect x="286" y="10" width="40" height="35" fill="#e53e3e" rx="5" />
      <rect x="328" y="10" width="90" height="35" fill="#166534" rx="5" />
      <rect x="420" y="10" width="90" height="35" fill="#166534" rx="5" />
      <rect x="512" y="10" width="90" height="35" fill="#166534" rx="5" />

      {/* Header Text */}
      <text x="35" y="32" fontSize="12" fill="white" fontWeight="700">
        Hundreds
      </text>
      <text x="132" y="32" fontSize="12" fill="white" fontWeight="700">
        Tens
      </text>
      <text x="225" y="32" fontSize="12" fill="white" fontWeight="700">
        Ones
      </text>
      <text x="293" y="32" fontSize="13" fill="white" fontWeight="800">
        .
      </text>
      <text x="338" y="32" fontSize="11" fill="white" fontWeight="700">
        Tenths
      </text>
      <text x="425" y="32" fontSize="10" fill="white" fontWeight="700">
        Hundredths
      </text>
      <text x="512" y="32" fontSize="9" fill="white" fontWeight="700">
        Thousandths
      </text>

      {/* Values Row */}
      <rect x="10" y="47" width="90" height="35" fill="#eef2ff" rx="5" />
      <rect x="102" y="47" width="90" height="35" fill="#eef2ff" rx="5" />
      <rect x="194" y="47" width="90" height="35" fill="#eef2ff" rx="5" />
      <rect x="286" y="47" width="40" height="35" fill="#fff1f2" rx="5" />
      <rect x="328" y="47" width="90" height="35" fill="#f0fdf4" rx="5" />
      <rect x="420" y="47" width="90" height="35" fill="#f0fdf4" rx="5" />
      <rect x="512" y="47" width="90" height="35" fill="#f0fdf4" rx="5" />

      {/* Values Text */}
      <text x="45" y="69" fontSize="13" fill="#4f46e5" fontWeight="700">
        100
      </text>
      <text x="140" y="69" fontSize="13" fill="#4f46e5" fontWeight="700">
        10
      </text>
      <text x="232" y="69" fontSize="13" fill="#4f46e5" fontWeight="700">
        1
      </text>
      <text x="295" y="69" fontSize="16" fill="#e53e3e" fontWeight="800">
        .
      </text>
      <text x="348" y="69" fontSize="12" fill="#166534" fontWeight="700">
        1/10
      </text>
      <text x="438" y="69" fontSize="12" fill="#166534" fontWeight="700">
        1/100
      </text>
      <text x="522" y="69" fontSize="12" fill="#166534" fontWeight="700">
        1/1000
      </text>

      {/* Example Row — 453.768 */}
      <rect x="10" y="84" width="90" height="35" fill="#fffbeb" rx="5" />
      <rect x="102" y="84" width="90" height="35" fill="#fffbeb" rx="5" />
      <rect x="194" y="84" width="90" height="35" fill="#fffbeb" rx="5" />
      <rect x="286" y="84" width="40" height="35" fill="#fff1f2" rx="5" />
      <rect x="328" y="84" width="90" height="35" fill="#f0fdf4" rx="5" />
      <rect x="420" y="84" width="90" height="35" fill="#f0fdf4" rx="5" />
      <rect x="512" y="84" width="90" height="35" fill="#f0fdf4" rx="5" />

      {/* Example digits */}
      <text x="50" y="106" fontSize="20" fill="#c05621" fontWeight="800">
        4
      </text>
      <text x="142" y="106" fontSize="20" fill="#c05621" fontWeight="800">
        5
      </text>
      <text x="234" y="106" fontSize="20" fill="#c05621" fontWeight="800">
        3
      </text>
      <text x="295" y="106" fontSize="20" fill="#e53e3e" fontWeight="800">
        .
      </text>
      <text x="362" y="106" fontSize="20" fill="#276749" fontWeight="800">
        7
      </text>
      <text x="454" y="106" fontSize="20" fill="#276749" fontWeight="800">
        6
      </text>
      <text x="546" y="106" fontSize="20" fill="#276749" fontWeight="800">
        8
      </text>

      {/* Label */}
      <text x="200" y="145" fontSize="12" fill="#666" fontWeight="600">
        Example: 453.768
      </text>
      <text x="10" y="158" fontSize="11" fill="#4f46e5">
        ← Whole number part
      </text>
      <text x="350" y="158" fontSize="11" fill="#166534">
        ← Decimal/Fractional part
      </text>
    </svg>
  </div>
);

const DiagramBarGraph = () => (
  <div style={diagStyles.inlineContainer}>
    <svg width="500" height="220" viewBox="0 0 500 220">
      {/* Title */}
      <text x="130" y="18" fontSize="13" fill="#1e1b4b" fontWeight="700">
        Favourite Sports of Students
      </text>

      {/* Y-axis */}
      <line x1="60" y1="20" x2="60" y2="175" stroke="#333" strokeWidth="2" />
      {/* X-axis */}
      <line x1="60" y1="175" x2="450" y2="175" stroke="#333" strokeWidth="2" />

      {/* Y-axis labels */}
      <text x="10" y="178" fontSize="11" fill="#666">
        0
      </text>
      <text x="10" y="143" fontSize="11" fill="#666">
        10
      </text>
      <text x="10" y="108" fontSize="11" fill="#666">
        20
      </text>
      <text x="10" y="73" fontSize="11" fill="#666">
        30
      </text>
      <text x="10" y="38" fontSize="11" fill="#666">
        40
      </text>

      {/* Y-axis grid lines */}
      <line x1="60" y1="140" x2="450" y2="140" stroke="#eee" strokeWidth="1" />
      <line x1="60" y1="105" x2="450" y2="105" stroke="#eee" strokeWidth="1" />
      <line x1="60" y1="70" x2="450" y2="70" stroke="#eee" strokeWidth="1" />
      <line x1="60" y1="35" x2="450" y2="35" stroke="#eee" strokeWidth="1" />

      {/* Bars */}
      {/* Cricket - 35 students */}
      <rect x="80" y="52" width="55" height="123" fill="#4f46e5" rx="4" />
      <text x="90" y="46" fontSize="11" fill="#4f46e5" fontWeight="700">
        35
      </text>
      <text x="82" y="192" fontSize="11" fill="#333">
        Cricket
      </text>

      {/* Football - 25 students */}
      <rect x="175" y="87" width="55" height="88" fill="#166534" rx="4" />
      <text x="185" y="81" fontSize="11" fill="#166534" fontWeight="700">
        25
      </text>
      <text x="175" y="192" fontSize="11" fill="#333">
        Football
      </text>

      {/* Badminton - 40 students */}
      <rect x="270" y="35" width="55" height="140" fill="#c05621" rx="4" />
      <text x="278" y="29" fontSize="11" fill="#c05621" fontWeight="700">
        40
      </text>
      <text x="265" y="192" fontSize="11" fill="#333">
        Badminton
      </text>

      {/* Hockey - 15 students */}
      <rect x="365" y="122" width="55" height="53" fill="#b45309" rx="4" />
      <text x="375" y="116" fontSize="11" fill="#b45309" fontWeight="700">
        15
      </text>
      <text x="370" y="192" fontSize="11" fill="#333">
        Hockey
      </text>

      {/* Y-axis title */}
      <text
        x="5"
        y="110"
        fontSize="11"
        fill="#666"
        transform="rotate(-90, 5, 110)"
      >
        Students →
      </text>

      {/* Scale note */}
      <text x="80" y="212" fontSize="11" fill="#666">
        Scale: Y-axis → 1 unit = 1 student
      </text>
    </svg>
  </div>
);

const DiagramPictograph = () => (
  <div style={diagStyles.inlineContainer}>
    <svg width="500" height="180" viewBox="0 0 500 180">
      {/* Title */}
      <text x="120" y="18" fontSize="13" fill="#1e1b4b" fontWeight="700">
        Books Read by Students (Each 📚 = 10 books)
      </text>

      {/* Table */}
      {/* Header */}
      <rect x="10" y="25" width="120" height="30" fill="#4f46e5" rx="4" />
      <rect x="132" y="25" width="250" height="30" fill="#4f46e5" rx="4" />
      <rect x="384" y="25" width="100" height="30" fill="#4f46e5" rx="4" />
      <text x="35" y="44" fontSize="12" fill="white" fontWeight="700">
        Student
      </text>
      <text x="210" y="44" fontSize="12" fill="white" fontWeight="700">
        Books
      </text>
      <text x="405" y="44" fontSize="12" fill="white" fontWeight="700">
        Total
      </text>

      {/* Row 1 - Rahul */}
      <rect x="10" y="57" width="120" height="28" fill="#eef2ff" rx="2" />
      <rect x="132" y="57" width="250" height="28" fill="#eef2ff" rx="2" />
      <rect x="384" y="57" width="100" height="28" fill="#eef2ff" rx="2" />
      <text x="35" y="75" fontSize="12" fill="#333">
        Rahul
      </text>
      <text x="140" y="75" fontSize="16">
        📚📚📚
      </text>
      <text x="410" y="75" fontSize="12" fill="#4f46e5" fontWeight="700">
        30
      </text>

      {/* Row 2 - Priya */}
      <rect x="10" y="87" width="120" height="28" fill="white" rx="2" />
      <rect x="132" y="87" width="250" height="28" fill="white" rx="2" />
      <rect x="384" y="87" width="100" height="28" fill="white" rx="2" />
      <text x="35" y="105" fontSize="12" fill="#333">
        Priya
      </text>
      <text x="140" y="105" fontSize="16">
        📚📚📚📚📚
      </text>
      <text x="410" y="105" fontSize="12" fill="#4f46e5" fontWeight="700">
        50
      </text>

      {/* Row 3 - Amit */}
      <rect x="10" y="117" width="120" height="28" fill="#eef2ff" rx="2" />
      <rect x="132" y="117" width="250" height="28" fill="#eef2ff" rx="2" />
      <rect x="384" y="117" width="100" height="28" fill="#eef2ff" rx="2" />
      <text x="35" y="135" fontSize="12" fill="#333">
        Amit
      </text>
      <text x="140" y="135" fontSize="16">
        📚📚
      </text>
      <text x="410" y="135" fontSize="12" fill="#4f46e5" fontWeight="700">
        20
      </text>

      {/* Row 4 - Neha */}
      <rect x="10" y="147" width="120" height="28" fill="white" rx="2" />
      <rect x="132" y="147" width="250" height="28" fill="white" rx="2" />
      <rect x="384" y="147" width="100" height="28" fill="white" rx="2" />
      <text x="35" y="165" fontSize="12" fill="#333">
        Neha
      </text>
      <text x="140" y="165" fontSize="16">
        📚📚📚📚
      </text>
      <text x="410" y="165" fontSize="12" fill="#4f46e5" fontWeight="700">
        40
      </text>

      {/* Key */}
      <text x="10" y="178" fontSize="11" fill="#666">
        Key: 📚 = 10 books
      </text>
    </svg>
  </div>
);

const DiagramPerimeterArea = () => (
  <div style={diagStyles.inlineContainer}>
    <svg width="580" height="180" viewBox="0 0 580 180">
      {/* Title */}
      <text x="170" y="18" fontSize="14" fill="#1e1b4b" fontWeight="800">
        Perimeter vs Area
      </text>

      {/* PERIMETER DIAGRAM */}
      <text x="30" y="40" fontSize="13" fill="#4f46e5" fontWeight="700">
        Perimeter (Boundary)
      </text>
      {/* Rectangle */}
      <rect
        x="30"
        y="50"
        width="180"
        height="100"
        fill="none"
        stroke="#4f46e5"
        strokeWidth="3"
        strokeDasharray="8"
      />
      {/* Arrows on sides */}
      <text x="90" y="45" fontSize="11" fill="#4f46e5" fontWeight="600">
        8 cm →
      </text>
      <text x="215" y="105" fontSize="11" fill="#4f46e5" fontWeight="600">
        5 cm
      </text>
      <text x="90" y="165" fontSize="11" fill="#4f46e5" fontWeight="600">
        8 cm →
      </text>
      <text x="5" y="105" fontSize="11" fill="#4f46e5" fontWeight="600">
        5 cm
      </text>
      {/* Formula */}
      <text x="30" y="178" fontSize="12" fill="#4f46e5" fontWeight="700">
        P = 2(8+5) = 26 cm
      </text>

      {/* AREA DIAGRAM */}
      <text x="340" y="40" fontSize="13" fill="#166534" fontWeight="700">
        Area (Surface)
      </text>
      {/* Grid - 4×3 */}
      {[0, 1, 2, 3].map((col) =>
        [0, 1, 2].map((row) => (
          <rect
            key={`${col}-${row}`}
            x={340 + col * 45}
            y={50 + row * 33}
            width="45"
            height="33"
            fill="#c6f6d5"
            stroke="#276749"
            strokeWidth="1.5"
          />
        )),
      )}
      {/* Labels */}
      <text x="370" y="45" fontSize="11" fill="#166534" fontWeight="600">
        4 cm
      </text>
      <text x="520" y="105" fontSize="11" fill="#166534" fontWeight="600">
        3 cm
      </text>
      <text x="355" y="160" fontSize="12" fill="#166534" fontWeight="700">
        A = 4×3 = 12 cm²
      </text>
      <text x="352" y="175" fontSize="11" fill="#166534">
        12 unit squares inside!
      </text>
    </svg>
  </div>
);

const DiagramEquation = () => (
  <div style={diagStyles.inlineContainer}>
    <svg width="600" height="200" viewBox="0 0 600 200">
      {/* Title */}
      <text x="180" y="18" fontSize="14" fill="#1e1b4b" fontWeight="800">
        Equation = Balance Scale!
      </text>

      {/* LEFT PAN */}
      <text x="60" y="40" fontSize="13" fill="#4f46e5" fontWeight="700">
        LHS (Left Side)
      </text>

      {/* Balance Stand */}
      <line x1="300" y1="60" x2="300" y2="150" stroke="#333" strokeWidth="3" />
      <line x1="150" y1="80" x2="450" y2="80" stroke="#333" strokeWidth="3" />
      <circle cx="300" cy="60" r="6" fill="#333" />

      {/* Left pan string */}
      <line x1="150" y1="80" x2="130" y2="120" stroke="#333" strokeWidth="2" />
      <line x1="150" y1="80" x2="200" y2="120" stroke="#333" strokeWidth="2" />
      {/* Left pan */}
      <ellipse cx="165" cy="122" rx="45" ry="10" fill="#4f46e5" opacity="0.8" />
      {/* Left weights */}
      <rect x="140" y="100" width="30" height="20" fill="#4f46e5" rx="4" />
      <text x="148" y="114" fontSize="10" fill="white" fontWeight="700">
        x+5
      </text>

      {/* Right pan string */}
      <line x1="450" y1="80" x2="430" y2="120" stroke="#333" strokeWidth="2" />
      <line x1="450" y1="80" x2="480" y2="120" stroke="#333" strokeWidth="2" />
      {/* Right pan */}
      <ellipse cx="455" cy="122" rx="45" ry="10" fill="#166534" opacity="0.8" />
      {/* Right weight */}
      <rect x="430" y="100" width="30" height="20" fill="#166534" rx="4" />
      <text x="440" y="114" fontSize="10" fill="white" fontWeight="700">
        12
      </text>

      {/* Base */}
      <rect x="270" y="148" width="60" height="12" fill="#333" rx="3" />
      <rect x="255" y="158" width="90" height="8" fill="#555" rx="3" />

      {/* Equal sign in middle */}
      <text x="284" y="90" fontSize="20" fill="#e53e3e" fontWeight="800">
        =
      </text>

      {/* RHS label */}
      <text x="400" y="40" fontSize="13" fill="#166534" fontWeight="700">
        RHS (Right Side)
      </text>

      {/* Solving steps */}
      <text x="30" y="175" fontSize="12" fill="#1e1b4b" fontWeight="700">
        Solving: x + 5 = 12
      </text>
      <text x="30" y="190" fontSize="12" fill="#4f46e5">
        Step 1: x + 5 − 5 = 12 − 5
      </text>
      <text x="350" y="190" fontSize="12" fill="#166534" fontWeight="700">
        → x = 7 ✅
      </text>

      {/* Balance note */}
      <text x="175" y="148" fontSize="11" fill="#666">
        Both sides must stay EQUAL!
      </text>
    </svg>
  </div>
);

const DiagramRatio = () => (
  <div style={diagStyles.inlineContainer}>
    <svg width="580" height="160" viewBox="0 0 580 160">
      {/* Title */}
      <text x="180" y="18" fontSize="14" fill="#1e1b4b" fontWeight="800">
        Ratio — Comparing Two Quantities
      </text>

      {/* Example 1 — Boys and Girls */}
      <text x="20" y="40" fontSize="13" fill="#4f46e5" fontWeight="700">
        Class: 18 Boys, 12 Girls
      </text>

      {/* Boys circles */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <circle
          key={i}
          cx={25 + i * 22}
          cy={65}
          r="9"
          fill="#4f46e5"
          opacity="0.8"
        />
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <circle
          key={i + 9}
          cx={25 + i * 22}
          cy={90}
          r="9"
          fill="#4f46e5"
          opacity="0.8"
        />
      ))}
      <text x="20" y="112" fontSize="11" fill="#4f46e5">
        Boys = 18
      </text>

      {/* Girls circles */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle
          key={i}
          cx={230 + i * 22}
          cy={65}
          r="9"
          fill="#e53e3e"
          opacity="0.8"
        />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle
          key={i + 6}
          cx={230 + i * 22}
          cy={90}
          r="9"
          fill="#e53e3e"
          opacity="0.8"
        />
      ))}
      <text x="230" y="112" fontSize="11" fill="#e53e3e">
        Girls = 12
      </text>

      {/* Ratio calculation */}
      <text x="20" y="135" fontSize="12" fill="#1e1b4b" fontWeight="600">
        Ratio of Boys:Girls = 18:12 = 3:2
      </text>
      <text x="20" y="152" fontSize="11" fill="#666">
        (Divide both by HCF = 6)
      </text>

      {/* Divider */}
      <line
        x1="390"
        y1="30"
        x2="390"
        y2="155"
        stroke="#ddd"
        strokeWidth="1.5"
      />

      {/* Example 2 — Proportion visual */}
      <text x="400" y="40" fontSize="13" fill="#166534" fontWeight="700">
        Proportion: a:b :: c:d
      </text>
      <text x="400" y="62" fontSize="13" fill="#1e1b4b">
        2 : 3 :: 8 : 12
      </text>

      {/* Extremes and Means */}
      <rect
        x="400"
        y="70"
        width="25"
        height="25"
        fill="#4f46e5"
        rx="4"
        opacity="0.8"
      />
      <text x="406" y="87" fontSize="12" fill="white" fontWeight="700">
        2
      </text>
      <rect
        x="432"
        y="70"
        width="25"
        height="25"
        fill="#166534"
        rx="4"
        opacity="0.8"
      />
      <text x="438" y="87" fontSize="12" fill="white" fontWeight="700">
        3
      </text>
      <text x="462" y="87" fontSize="14" fill="#333">
        ::
      </text>
      <rect
        x="480"
        y="70"
        width="25"
        height="25"
        fill="#166534"
        rx="4"
        opacity="0.8"
      />
      <text x="486" y="87" fontSize="12" fill="white" fontWeight="700">
        8
      </text>
      <rect
        x="512"
        y="70"
        width="25"
        height="25"
        fill="#4f46e5"
        rx="4"
        opacity="0.8"
      />
      <text x="518" y="87" fontSize="12" fill="white" fontWeight="700">
        12
      </text>

      {/* Extremes arrow */}
      <path
        d="M 412 100 Q 465 120 524 100"
        stroke="#4f46e5"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="4"
      />
      <text x="435" y="130" fontSize="11" fill="#4f46e5">
        Extremes: 2×12=24
      </text>

      {/* Means arrow */}
      <path
        d="M 444 98 Q 465 108 492 98"
        stroke="#166534"
        strokeWidth="1.5"
        fill="none"
      />
      <text x="435" y="148" fontSize="11" fill="#166534">
        Means: 3×8=24 ✅
      </text>
    </svg>
  </div>
);

const DiagramProportion = () => (
  <div style={diagStyles.inlineContainer}>
    <svg width="580" height="170" viewBox="0 0 580 170">
      {/* Title */}
      <text x="150" y="18" fontSize="14" fill="#1e1b4b" fontWeight="800">
        Direct vs Inverse Proportion
      </text>

      {/* DIRECT PROPORTION */}
      <rect
        x="10"
        y="25"
        width="260"
        height="140"
        fill="#f0fdf4"
        rx="10"
        stroke="#86efac"
        strokeWidth="2"
      />
      <text x="70" y="45" fontSize="13" fill="#166534" fontWeight="700">
        ⬆️ Direct Proportion
      </text>
      <text x="20" y="65" fontSize="11" fill="#166534">
        When one ↑ other also ↑
      </text>

      {/* Direct proportion graph — rising line */}
      <line x1="30" y1="150" x2="30" y2="75" stroke="#166534" strokeWidth="2" />
      <line
        x1="30"
        y1="150"
        x2="150"
        y2="150"
        stroke="#166534"
        strokeWidth="2"
      />
      <line
        x1="30"
        y1="150"
        x2="145"
        y2="80"
        stroke="#166534"
        strokeWidth="2.5"
      />
      <polygon points="145,80 135,88 138,78" fill="#166534" />
      <text x="32" y="168" fontSize="10" fill="#166534">
        Items →
      </text>
      <text x="155" y="115" fontSize="10" fill="#166534">
        Cost ↑
      </text>

      {/* Direct examples */}
      <text x="170" y="90" fontSize="11" fill="#166534">
        ✔ More items
      </text>
      <text x="170" y="106" fontSize="11" fill="#166534">
        {" "}
        = More cost
      </text>
      <text x="170" y="122" fontSize="11" fill="#166534">
        ✔ More hours
      </text>
      <text x="170" y="138" fontSize="11" fill="#166534">
        {" "}
        = More work
      </text>
      <text x="20" y="168" fontSize="11" fill="#166534" fontWeight="600">
        Formula: a/b = c/d
      </text>

      {/* INVERSE PROPORTION */}
      <rect
        x="310"
        y="25"
        width="260"
        height="140"
        fill="#fff1f2"
        rx="10"
        stroke="#fecdd3"
        strokeWidth="2"
      />
      <text x="360" y="45" fontSize="13" fill="#e53e3e" fontWeight="700">
        ⬇️ Inverse Proportion
      </text>
      <text x="320" y="65" fontSize="11" fill="#e53e3e">
        When one ↑ other ↓
      </text>

      {/* Inverse proportion graph — falling line */}
      <line
        x1="330"
        y1="150"
        x2="330"
        y2="75"
        stroke="#e53e3e"
        strokeWidth="2"
      />
      <line
        x1="330"
        y1="150"
        x2="450"
        y2="150"
        stroke="#e53e3e"
        strokeWidth="2"
      />
      <line
        x1="330"
        y1="80"
        x2="445"
        y2="148"
        stroke="#e53e3e"
        strokeWidth="2.5"
      />
      <polygon points="445,148 435,138 443,136" fill="#e53e3e" />
      <text x="332" y="168" fontSize="10" fill="#e53e3e">
        Workers →
      </text>
      <text x="448" y="130" fontSize="10" fill="#e53e3e">
        Days ↓
      </text>

      {/* Inverse examples */}
      <text x="460" y="90" fontSize="11" fill="#e53e3e">
        ✔ More workers
      </text>
      <text x="460" y="106" fontSize="11" fill="#e53e3e">
        {" "}
        = Less days
      </text>
      <text x="460" y="122" fontSize="11" fill="#e53e3e">
        ✔ More speed
      </text>
      <text x="460" y="138" fontSize="11" fill="#e53e3e">
        {" "}
        = Less time
      </text>
      <text x="320" y="168" fontSize="11" fill="#e53e3e" fontWeight="600">
        Formula: a×b = c×d
      </text>
    </svg>
  </div>
);

const DiagramPolygons = () => (
  <div style={diagStyles.inlineContainer}>
    <svg width="580" height="110" viewBox="0 0 580 110">
      {/* Triangle */}
      <polygon
        points="50,15 10,95 90,95"
        fill="#c6f6d5"
        stroke="#276749"
        strokeWidth="2"
      />
      <text x="25" y="108" fontSize="10" fill="#276749" fontWeight="600">
        Triangle (3)
      </text>
      {/* Square */}
      <rect
        x="110"
        y="20"
        width="70"
        height="70"
        fill="#bee3f8"
        stroke="#2b6cb0"
        strokeWidth="2"
      />
      <text x="115" y="108" fontSize="10" fill="#2b6cb0" fontWeight="600">
        Quadrilateral (4)
      </text>
      {/* Pentagon */}
      <polygon
        points="255,15 285,38 274,72 236,72 225,38"
        fill="#fbd38d"
        stroke="#c05621"
        strokeWidth="2"
      />
      <text x="222" y="108" fontSize="10" fill="#c05621" fontWeight="600">
        Pentagon (5)
      </text>
      {/* Hexagon */}
      <polygon
        points="355,15 385,28 385,68 355,82 325,68 325,28"
        fill="#e9d8fd"
        stroke="#553c9a"
        strokeWidth="2"
      />
      <text x="322" y="108" fontSize="10" fill="#553c9a" fontWeight="600">
        Hexagon (6)
      </text>
      {/* Octagon */}
      <polygon
        points="480,15 505,20 520,45 520,65 505,90 480,95 455,90 440,65 440,45 455,20"
        fill="#fed7d7"
        stroke="#c53030"
        strokeWidth="2"
      />
      <text x="445" y="108" fontSize="10" fill="#c53030" fontWeight="600">
        Octagon (8)
      </text>
    </svg>
  </div>
);

const DiagramSymmetry = () => (
  <div style={diagStyles.inlineContainer}>
    <svg width="580" height="160" viewBox="0 0 580 160">
      <text x="190" y="18" fontSize="14" fill="#1e1b4b" fontWeight="800">
        Lines of Symmetry in Shapes
      </text>

      {/* Equilateral Triangle — 3 lines */}
      <polygon
        points="55,130 15,130 35,90"
        fill="#c6f6d5"
        stroke="#276749"
        strokeWidth="2"
      />
      <line
        x1="35"
        y1="90"
        x2="35"
        y2="130"
        stroke="#e53e3e"
        strokeWidth="1.5"
        strokeDasharray="4"
      />
      <line
        x1="15"
        y1="130"
        x2="55"
        y2="110"
        stroke="#e53e3e"
        strokeWidth="1.5"
        strokeDasharray="4"
      />
      <line
        x1="55"
        y1="130"
        x2="15"
        y2="110"
        stroke="#e53e3e"
        strokeWidth="1.5"
        strokeDasharray="4"
      />
      <text x="18" y="148" fontSize="10" fill="#276749" fontWeight="600">
        Equilateral △
      </text>
      <text x="25" y="158" fontSize="10" fill="#e53e3e">
        3 lines
      </text>

      {/* Isosceles Triangle — 1 line */}
      <polygon
        points="130,130 90,130 110,85"
        fill="#bee3f8"
        stroke="#2b6cb0"
        strokeWidth="2"
      />
      <line
        x1="110"
        y1="85"
        x2="110"
        y2="130"
        stroke="#e53e3e"
        strokeWidth="1.5"
        strokeDasharray="4"
      />
      <text x="93" y="148" fontSize="10" fill="#2b6cb0" fontWeight="600">
        Isosceles △
      </text>
      <text x="100" y="158" fontSize="10" fill="#e53e3e">
        1 line
      </text>

      {/* Rectangle — 2 lines */}
      <rect
        x="155"
        y="95"
        width="80"
        height="45"
        fill="#fbd38d"
        stroke="#c05621"
        strokeWidth="2"
      />
      <line
        x1="195"
        y1="95"
        x2="195"
        y2="140"
        stroke="#e53e3e"
        strokeWidth="1.5"
        strokeDasharray="4"
      />
      <line
        x1="155"
        y1="117"
        x2="235"
        y2="117"
        stroke="#e53e3e"
        strokeWidth="1.5"
        strokeDasharray="4"
      />
      <text x="160" y="153" fontSize="10" fill="#c05621" fontWeight="600">
        Rectangle
      </text>
      <text x="168" y="163" fontSize="10" fill="#e53e3e">
        2 lines
      </text>

      {/* Square — 4 lines */}
      <rect
        x="265"
        y="90"
        width="55"
        height="55"
        fill="#e9d8fd"
        stroke="#553c9a"
        strokeWidth="2"
      />
      <line
        x1="292"
        y1="90"
        x2="292"
        y2="145"
        stroke="#e53e3e"
        strokeWidth="1.5"
        strokeDasharray="4"
      />
      <line
        x1="265"
        y1="117"
        x2="320"
        y2="117"
        stroke="#e53e3e"
        strokeWidth="1.5"
        strokeDasharray="4"
      />
      <line
        x1="265"
        y1="90"
        x2="320"
        y2="145"
        stroke="#4f46e5"
        strokeWidth="1.5"
        strokeDasharray="4"
      />
      <line
        x1="320"
        y1="90"
        x2="265"
        y2="145"
        stroke="#4f46e5"
        strokeWidth="1.5"
        strokeDasharray="4"
      />
      <text x="270" y="158" fontSize="10" fill="#553c9a" fontWeight="600">
        Square
      </text>
      <text x="272" y="168" fontSize="10" fill="#e53e3e">
        4 lines
      </text>

      {/* Regular Hexagon — 6 lines */}
      <polygon
        points="390,88 415,95 415,115 390,122 365,115 365,95"
        fill="#fed7d7"
        stroke="#c53030"
        strokeWidth="2"
      />
      <line
        x1="390"
        y1="88"
        x2="390"
        y2="122"
        stroke="#e53e3e"
        strokeWidth="1.5"
        strokeDasharray="3"
      />
      <line
        x1="365"
        y1="95"
        x2="415"
        y2="115"
        stroke="#e53e3e"
        strokeWidth="1.5"
        strokeDasharray="3"
      />
      <line
        x1="415"
        y1="95"
        x2="365"
        y2="115"
        stroke="#e53e3e"
        strokeWidth="1.5"
        strokeDasharray="3"
      />
      <line
        x1="365"
        y1="105"
        x2="415"
        y2="105"
        stroke="#4f46e5"
        strokeWidth="1.5"
        strokeDasharray="3"
      />
      <line
        x1="377"
        y1="88"
        x2="402"
        y2="122"
        stroke="#4f46e5"
        strokeWidth="1.5"
        strokeDasharray="3"
      />
      <line
        x1="402"
        y1="88"
        x2="377"
        y2="122"
        stroke="#4f46e5"
        strokeWidth="1.5"
        strokeDasharray="3"
      />
      <text x="363" y="135" fontSize="10" fill="#c53030" fontWeight="600">
        Regular Hexagon
      </text>
      <text x="375" y="145" fontSize="10" fill="#e53e3e">
        6 lines
      </text>

      {/* Circle — infinite */}
      <circle
        cx="510"
        cy="110"
        r="35"
        stroke="#1e1b4b"
        strokeWidth="2"
        fill="#f0fdf4"
      />
      <line
        x1="510"
        y1="75"
        x2="510"
        y2="145"
        stroke="#e53e3e"
        strokeWidth="1.5"
        strokeDasharray="4"
      />
      <line
        x1="475"
        y1="110"
        x2="545"
        y2="110"
        stroke="#e53e3e"
        strokeWidth="1.5"
        strokeDasharray="4"
      />
      <line
        x1="485"
        y1="85"
        x2="535"
        y2="135"
        stroke="#4f46e5"
        strokeWidth="1"
        strokeDasharray="3"
      />
      <line
        x1="535"
        y1="85"
        x2="485"
        y2="135"
        stroke="#4f46e5"
        strokeWidth="1"
        strokeDasharray="3"
      />
      <text x="490" y="155" fontSize="10" fill="#1e1b4b" fontWeight="600">
        Circle
      </text>
      <text x="483" y="165" fontSize="10" fill="#e53e3e">
        ∞ lines
      </text>
    </svg>
  </div>
);

const DiagramTools = () => (
  <div style={diagStyles.inlineContainer}>
    <svg width="580" height="130" viewBox="0 0 580 130">
      <text x="210" y="18" fontSize="14" fill="#1e1b4b" fontWeight="800">
        Geometric Tools
      </text>

      {/* Compass */}
      <rect
        x="10"
        y="28"
        width="120"
        height="90"
        fill="#eef2ff"
        rx="8"
        stroke="#c7d2fe"
        strokeWidth="1.5"
      />
      <text x="45" y="45" fontSize="12" fill="#4f46e5" fontWeight="700">
        Compass
      </text>
      <line x1="65" y1="55" x2="50" y2="105" stroke="#333" strokeWidth="2.5" />
      <line x1="65" y1="55" x2="80" y2="105" stroke="#333" strokeWidth="2.5" />
      <circle cx="65" cy="52" r="5" fill="#4f46e5" />
      <circle cx="50" cy="107" r="3" fill="#333" />
      <rect x="76" y="100" width="8" height="10" fill="#666" rx="1" />
      <text x="18" y="122" fontSize="10" fill="#4f46e5">
        Draws circles/arcs
      </text>

      {/* Ruler */}
      <rect
        x="148"
        y="28"
        width="120"
        height="90"
        fill="#f0fdf4"
        rx="8"
        stroke="#86efac"
        strokeWidth="1.5"
      />
      <text x="185" y="45" fontSize="12" fill="#166534" fontWeight="700">
        Ruler
      </text>
      <rect
        x="163"
        y="55"
        width="90"
        height="20"
        fill="#fbd38d"
        stroke="#c05621"
        strokeWidth="1.5"
        rx="2"
      />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <line
          key={i}
          x1={163 + i * 10}
          y1="55"
          x2={163 + i * 10}
          y2={i % 5 === 0 ? 68 : 63}
          stroke="#333"
          strokeWidth="1"
        />
      ))}
      <text x="160" y="92" fontSize="10" fill="#166634">
        Draws straight lines
      </text>
      <text x="163" y="105" fontSize="10" fill="#166634">
        Measures lengths
      </text>

      {/* Protractor */}
      <rect
        x="286"
        y="28"
        width="120"
        height="90"
        fill="#fffbeb"
        rx="8"
        stroke="#fcd34d"
        strokeWidth="1.5"
      />
      <text x="318" y="45" fontSize="12" fill="#b45309" fontWeight="700">
        Protractor
      </text>
      <path
        d="M 306 95 A 40 40 0 0 1 386 95"
        stroke="#b45309"
        strokeWidth="2"
        fill="none"
      />
      <line
        x1="306"
        y1="95"
        x2="386"
        y2="95"
        stroke="#b45309"
        strokeWidth="1.5"
      />
      <line
        x1="346"
        y1="95"
        x2="346"
        y2="55"
        stroke="#e53e3e"
        strokeWidth="1"
        strokeDasharray="3"
      />
      <text x="295" y="115" fontSize="10" fill="#b45309">
        Measures angles
      </text>
      <text x="300" y="126" fontSize="10" fill="#b45309">
        0° to 180°
      </text>

      {/* Set Square */}
      <rect
        x="424"
        y="28"
        width="140"
        height="90"
        fill="#fff1f2"
        rx="8"
        stroke="#fecdd3"
        strokeWidth="1.5"
      />
      <text x="460" y="45" fontSize="12" fill="#c53030" fontWeight="700">
        Set Square
      </text>
      <polygon
        points="440,100 440,60 480,100"
        fill="#fed7d7"
        stroke="#c53030"
        strokeWidth="2"
      />
      <rect
        x="440"
        y="90"
        width="10"
        height="10"
        fill="none"
        stroke="#c53030"
        strokeWidth="1.5"
      />
      <text x="438" y="118" fontSize="9" fill="#c53030">
        30-60-90
      </text>
      <polygon
        points="500,100 500,65 535,100"
        fill="#fed7d7"
        stroke="#c53030"
        strokeWidth="2"
      />
      <rect
        x="500"
        y="90"
        width="10"
        height="10"
        fill="none"
        stroke="#c53030"
        strokeWidth="1.5"
      />
      <text x="498" y="118" fontSize="9" fill="#c53030">
        45-45-90
      </text>
    </svg>
  </div>
);

const DiagramPerpBisector = () => (
  <div style={diagStyles.inlineContainer}>
    <svg width="580" height="170" viewBox="0 0 580 170">
      <text x="160" y="18" fontSize="14" fill="#1e1b4b" fontWeight="800">
        Constructing Perpendicular Bisector
      </text>

      {/* Step 1 */}
      <rect
        x="10"
        y="25"
        width="120"
        height="130"
        fill="#eef2ff"
        rx="8"
        stroke="#c7d2fe"
        strokeWidth="1.5"
      />
      <text x="30" y="42" fontSize="11" fill="#4f46e5" fontWeight="700">
        Step 1
      </text>
      <text x="15" y="56" fontSize="10" fill="#333">
        Draw segment AB
      </text>
      <line
        x1="25"
        y1="90"
        x2="115"
        y2="90"
        stroke="#1e1b4b"
        strokeWidth="2.5"
      />
      <circle cx="25" cy="90" r="4" fill="#1e1b4b" />
      <circle cx="115" cy="90" r="4" fill="#1e1b4b" />
      <text x="20" y="82" fontSize="12" fill="#1e1b4b" fontWeight="bold">
        A
      </text>
      <text x="110" y="82" fontSize="12" fill="#1e1b4b" fontWeight="bold">
        B
      </text>

      {/* Step 2 */}
      <rect
        x="145"
        y="25"
        width="120"
        height="130"
        fill="#f0fdf4"
        rx="8"
        stroke="#86efac"
        strokeWidth="1.5"
      />
      <text x="165" y="42" fontSize="11" fill="#166534" fontWeight="700">
        Step 2 & 3
      </text>
      <text x="148" y="56" fontSize="10" fill="#333">
        Arcs from A and B
      </text>
      <line
        x1="170"
        y1="90"
        x2="250"
        y2="90"
        stroke="#1e1b4b"
        strokeWidth="2.5"
      />
      <circle cx="170" cy="90" r="4" fill="#1e1b4b" />
      <circle cx="250" cy="90" r="4" fill="#1e1b4b" />
      <path
        d="M 155 65 A 45 45 0 0 1 185 65"
        stroke="#4f46e5"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="4"
      />
      <path
        d="M 155 115 A 45 45 0 0 0 185 115"
        stroke="#4f46e5"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="4"
      />
      <path
        d="M 235 65 A 45 45 0 0 0 265 65"
        stroke="#166534"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="4"
      />
      <path
        d="M 235 115 A 45 45 0 0 1 265 115"
        stroke="#166534"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="4"
      />
      <circle cx="210" cy="62" r="3" fill="#e53e3e" />
      <circle cx="210" cy="118" r="3" fill="#e53e3e" />
      <text x="213" y="58" fontSize="10" fill="#e53e3e" fontWeight="bold">
        P
      </text>
      <text x="213" y="132" fontSize="10" fill="#e53e3e" fontWeight="bold">
        Q
      </text>

      {/* Step 3 — Final */}
      <rect
        x="280"
        y="25"
        width="140"
        height="130"
        fill="#fffbeb"
        rx="8"
        stroke="#fcd34d"
        strokeWidth="1.5"
      />
      <text x="310" y="42" fontSize="11" fill="#b45309" fontWeight="700">
        Step 4 — Final
      </text>
      <text x="283" y="56" fontSize="10" fill="#333">
        Join P and Q → Done!
      </text>
      <line
        x1="305"
        y1="90"
        x2="395"
        y2="90"
        stroke="#1e1b4b"
        strokeWidth="2.5"
      />
      <circle cx="305" cy="90" r="4" fill="#1e1b4b" />
      <circle cx="395" cy="90" r="4" fill="#1e1b4b" />
      <text x="298" y="82" fontSize="12" fill="#1e1b4b" fontWeight="bold">
        A
      </text>
      <text x="390" y="82" fontSize="12" fill="#1e1b4b" fontWeight="bold">
        B
      </text>
      <line
        x1="350"
        y1="40"
        x2="350"
        y2="140"
        stroke="#e53e3e"
        strokeWidth="2"
        strokeDasharray="5"
      />
      <circle cx="350" cy="90" r="4" fill="#e53e3e" />
      <rect
        x="350"
        y="90"
        width="10"
        height="10"
        fill="none"
        stroke="#e53e3e"
        strokeWidth="2"
      />
      <text x="355" y="38" fontSize="11" fill="#e53e3e" fontWeight="bold">
        P
      </text>
      <text x="355" y="148" fontSize="11" fill="#e53e3e" fontWeight="bold">
        Q
      </text>
      <text x="283" y="160" fontSize="10" fill="#e53e3e" fontWeight="600">
        PQ ⊥ AB at midpoint M ✅
      </text>

      {/* Note */}
      <rect
        x="435"
        y="25"
        width="135"
        height="130"
        fill="#fff1f2"
        rx="8"
        stroke="#fecdd3"
        strokeWidth="1.5"
      />
      <text x="445" y="42" fontSize="11" fill="#c53030" fontWeight="700">
        ⚠️ Remember!
      </text>
      <text x="440" y="60" fontSize="10" fill="#333">
        Compass must be
      </text>
      <text x="440" y="74" fontSize="10" fill="#e53e3e" fontWeight="600">
        MORE than HALF
      </text>
      <text x="440" y="88" fontSize="10" fill="#333">
        of AB length!
      </text>
      <text x="440" y="110" fontSize="10" fill="#333">
        Keep SAME compass
      </text>
      <text x="440" y="124" fontSize="10" fill="#333">
        opening for both
      </text>
      <text x="440" y="138" fontSize="10" fill="#333">
        A and B arcs!
      </text>
    </svg>
  </div>
);

const DiagramAngles60 = () => (
  <div style={diagStyles.inlineContainer}>
    <svg width="580" height="150" viewBox="0 0 580 150">
      <text x="180" y="18" fontSize="14" fill="#1e1b4b" fontWeight="800">
        Constructing Special Angles
      </text>

      {/* 60 degree */}
      <rect
        x="10"
        y="25"
        width="120"
        height="115"
        fill="#eef2ff"
        rx="8"
        stroke="#c7d2fe"
        strokeWidth="1.5"
      />
      <text x="40" y="42" fontSize="12" fill="#4f46e5" fontWeight="700">
        60° Angle
      </text>
      <line
        x1="25"
        y1="120"
        x2="115"
        y2="120"
        stroke="#1e1b4b"
        strokeWidth="2"
      />
      <line x1="25" y1="120" x2="70" y2="55" stroke="#1e1b4b" strokeWidth="2" />
      <path
        d="M 50 120 A 25 25 0 0 0 38 98"
        stroke="#e53e3e"
        strokeWidth="1.5"
        fill="none"
      />
      <text x="52" y="112" fontSize="11" fill="#e53e3e" fontWeight="bold">
        60°
      </text>
      <circle cx="25" cy="120" r="3" fill="#e53e3e" />
      <text x="18" y="113" fontSize="11" fill="#1e1b4b" fontWeight="bold">
        A
      </text>
      <text x="110" y="113" fontSize="11" fill="#1e1b4b" fontWeight="bold">
        B
      </text>

      {/* 90 degree */}
      <rect
        x="148"
        y="25"
        width="120"
        height="115"
        fill="#f0fdf4"
        rx="8"
        stroke="#86efac"
        strokeWidth="1.5"
      />
      <text x="178" y="42" fontSize="12" fill="#166534" fontWeight="700">
        90° Angle
      </text>
      <line
        x1="163"
        y1="120"
        x2="253"
        y2="120"
        stroke="#1e1b4b"
        strokeWidth="2"
      />
      <line
        x1="208"
        y1="120"
        x2="208"
        y2="55"
        stroke="#1e1b4b"
        strokeWidth="2"
      />
      <rect
        x="208"
        y="110"
        width="10"
        height="10"
        fill="none"
        stroke="#e53e3e"
        strokeWidth="2"
      />
      <text x="213" y="108" fontSize="11" fill="#e53e3e" fontWeight="bold">
        90°
      </text>
      <text x="158" y="113" fontSize="9" fill="#166534">
        Perpendicular
      </text>
      <text x="158" y="125" fontSize="9" fill="#166534">
        bisector method
      </text>

      {/* 30 degree */}
      <rect
        x="286"
        y="25"
        width="120"
        height="115"
        fill="#fffbeb"
        rx="8"
        stroke="#fcd34d"
        strokeWidth="1.5"
      />
      <text x="316" y="42" fontSize="12" fill="#b45309" fontWeight="700">
        30° Angle
      </text>
      <line
        x1="301"
        y1="120"
        x2="391"
        y2="120"
        stroke="#1e1b4b"
        strokeWidth="2"
      />
      <line
        x1="301"
        y1="120"
        x2="340"
        y2="75"
        stroke="#1e1b4b"
        strokeWidth="2"
      />
      <path
        d="M 322 120 A 21 21 0 0 0 314 102"
        stroke="#e53e3e"
        strokeWidth="1.5"
        fill="none"
      />
      <text x="324" y="113" fontSize="11" fill="#e53e3e" fontWeight="bold">
        30°
      </text>
      <line
        x1="301"
        y1="120"
        x2="368"
        y2="75"
        stroke="#4f46e5"
        strokeWidth="1.5"
        strokeDasharray="4"
      />
      <text x="295" y="138" fontSize="9" fill="#b45309">
        Bisect 60° → get 30°
      </text>

      {/* 45 degree */}
      <rect
        x="424"
        y="25"
        width="145"
        height="115"
        fill="#fff1f2"
        rx="8"
        stroke="#fecdd3"
        strokeWidth="1.5"
      />
      <text x="464" y="42" fontSize="12" fill="#c53030" fontWeight="700">
        45° Angle
      </text>
      <line
        x1="439"
        y1="120"
        x2="549"
        y2="120"
        stroke="#1e1b4b"
        strokeWidth="2"
      />
      <line
        x1="494"
        y1="120"
        x2="494"
        y2="60"
        stroke="#1e1b4b"
        strokeWidth="1.5"
        strokeDasharray="4"
      />
      <line
        x1="439"
        y1="120"
        x2="494"
        y2="65"
        stroke="#1e1b4b"
        strokeWidth="2"
      />
      <path
        d="M 464 120 A 25 25 0 0 0 452 100"
        stroke="#e53e3e"
        strokeWidth="1.5"
        fill="none"
      />
      <text x="466" y="112" fontSize="11" fill="#e53e3e" fontWeight="bold">
        45°
      </text>
      <text x="432" y="138" fontSize="9" fill="#c53030">
        Bisect 90° → get 45°
      </text>
    </svg>
  </div>
);

// ============================================================
// TOP OVERVIEW DIAGRAM
// ============================================================
const GeometryDiagrams = () => (
  <div style={diagStyles.container}>
    <h3 style={diagStyles.title}>📐 Quick Visual Overview — All Topics</h3>

    {/* Row 1 */}
    <div style={diagStyles.row}>
      <div style={diagStyles.card}>
        <div style={diagStyles.cardTitle}>Point</div>
        <svg width="80" height="60" viewBox="0 0 80 60">
          <circle cx="40" cy="30" r="5" fill="#1e1b4b" />
          <text x="50" y="34" fontSize="14" fill="#1e1b4b" fontWeight="bold">
            A
          </text>
        </svg>
      </div>

      <div style={diagStyles.card}>
        <div style={diagStyles.cardTitle}>Line Segment</div>
        <svg width="130" height="60" viewBox="0 0 130 60">
          <line
            x1="15"
            y1="30"
            x2="115"
            y2="30"
            stroke="#1e1b4b"
            strokeWidth="2.5"
          />
          <circle cx="15" cy="30" r="4" fill="#1e1b4b" />
          <circle cx="115" cy="30" r="4" fill="#1e1b4b" />
          <text x="8" y="20" fontSize="12" fill="#1e1b4b" fontWeight="bold">
            A
          </text>
          <text x="108" y="20" fontSize="12" fill="#1e1b4b" fontWeight="bold">
            B
          </text>
        </svg>
      </div>

      <div style={diagStyles.card}>
        <div style={diagStyles.cardTitle}>Line</div>
        <svg width="130" height="60" viewBox="0 0 130 60">
          <line
            x1="10"
            y1="30"
            x2="120"
            y2="30"
            stroke="#1e1b4b"
            strokeWidth="2.5"
          />
          <polygon points="4,30 16,24 16,36" fill="#1e1b4b" />
          <polygon points="126,30 114,24 114,36" fill="#1e1b4b" />
        </svg>
      </div>

      <div style={diagStyles.card}>
        <div style={diagStyles.cardTitle}>Ray</div>
        <svg width="130" height="60" viewBox="0 0 130 60">
          <line
            x1="15"
            y1="30"
            x2="115"
            y2="30"
            stroke="#1e1b4b"
            strokeWidth="2.5"
          />
          <circle cx="15" cy="30" r="4" fill="#1e1b4b" />
          <polygon points="123,30 111,24 111,36" fill="#1e1b4b" />
          <text x="8" y="20" fontSize="12" fill="#1e1b4b" fontWeight="bold">
            P
          </text>
          <text x="110" y="20" fontSize="12" fill="#1e1b4b" fontWeight="bold">
            Q
          </text>
        </svg>
      </div>

      <div style={diagStyles.card}>
        <div style={diagStyles.cardTitle}>Angle</div>
        <svg width="100" height="60" viewBox="0 0 100 60">
          <line
            x1="15"
            y1="55"
            x2="90"
            y2="55"
            stroke="#1e1b4b"
            strokeWidth="2"
          />
          <line
            x1="15"
            y1="55"
            x2="60"
            y2="10"
            stroke="#1e1b4b"
            strokeWidth="2"
          />
          <path
            d="M 38 55 A 23 23 0 0 0 26 38"
            stroke="#e53e3e"
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx="15" cy="55" r="3" fill="#e53e3e" />
          <text x="40" y="50" fontSize="10" fill="#e53e3e">
            45°
          </text>
        </svg>
      </div>
    </div>

    {/* Row 2 */}
    <div style={diagStyles.row}>
      <div style={diagStyles.card}>
        <div style={diagStyles.cardTitle}>Parallel Lines</div>
        <svg width="130" height="60" viewBox="0 0 130 60">
          <line
            x1="10"
            y1="20"
            x2="120"
            y2="20"
            stroke="#4f46e5"
            strokeWidth="2"
          />
          <line
            x1="10"
            y1="45"
            x2="120"
            y2="45"
            stroke="#4f46e5"
            strokeWidth="2"
          />
          <polygon points="4,20 16,14 16,26" fill="#4f46e5" />
          <polygon points="126,20 114,14 114,26" fill="#4f46e5" />
          <polygon points="4,45 16,39 16,51" fill="#4f46e5" />
          <polygon points="126,45 114,39 114,51" fill="#4f46e5" />
        </svg>
      </div>

      <div style={diagStyles.card}>
        <div style={diagStyles.cardTitle}>Intersecting</div>
        <svg width="100" height="60" viewBox="0 0 100 60">
          <line
            x1="10"
            y1="10"
            x2="90"
            y2="55"
            stroke="#e53e3e"
            strokeWidth="2"
          />
          <line
            x1="90"
            y1="10"
            x2="10"
            y2="55"
            stroke="#e53e3e"
            strokeWidth="2"
          />
          <circle cx="50" cy="32" r="4" fill="#1e1b4b" />
        </svg>
      </div>

      <div style={diagStyles.card}>
        <div style={diagStyles.cardTitle}>Perpendicular</div>
        <svg width="100" height="60" viewBox="0 0 100 60">
          <line
            x1="10"
            y1="35"
            x2="90"
            y2="35"
            stroke="#166534"
            strokeWidth="2"
          />
          <line
            x1="50"
            y1="5"
            x2="50"
            y2="60"
            stroke="#166534"
            strokeWidth="2"
          />
          <rect
            x="50"
            y="35"
            width="8"
            height="8"
            fill="none"
            stroke="#166534"
            strokeWidth="1.5"
          />
          <text x="55" y="30" fontSize="10" fill="#166534">
            90°
          </text>
        </svg>
      </div>

      <div style={diagStyles.card}>
        <div style={diagStyles.cardTitle}>Triangle</div>
        <svg width="100" height="60" viewBox="0 0 100 60">
          <polygon
            points="50,5 10,55 90,55"
            fill="#c6f6d5"
            stroke="#276749"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div style={diagStyles.card}>
        <div style={diagStyles.cardTitle}>Circle</div>
        <svg width="80" height="60" viewBox="0 0 80 60">
          <circle
            cx="40"
            cy="30"
            r="25"
            stroke="#1e1b4b"
            strokeWidth="2.5"
            fill="#eef2ff"
          />
          <circle cx="40" cy="30" r="3" fill="#e53e3e" />
          <line
            x1="40"
            y1="30"
            x2="65"
            y2="30"
            stroke="#4f46e5"
            strokeWidth="2"
          />
          <text x="44" y="26" fontSize="9" fill="#e53e3e">
            O
          </text>
        </svg>
      </div>
    </div>

    {/* Row 3 */}
    <div style={diagStyles.row}>
      <div style={diagStyles.card}>
        <div style={diagStyles.cardTitle}>Open Curve</div>
        <svg width="100" height="60" viewBox="0 0 100 60">
          <path
            d="M 10 45 C 25 10, 55 55, 90 30"
            stroke="#4f46e5"
            strokeWidth="2.5"
            fill="none"
          />
          <circle cx="10" cy="45" r="3" fill="#4f46e5" />
          <circle cx="90" cy="30" r="3" fill="#4f46e5" />
        </svg>
      </div>

      <div style={diagStyles.card}>
        <div style={diagStyles.cardTitle}>Closed Curve</div>
        <svg width="100" height="60" viewBox="0 0 100 60">
          <ellipse
            cx="50"
            cy="30"
            rx="40"
            ry="22"
            stroke="#166534"
            strokeWidth="2.5"
            fill="none"
          />
        </svg>
      </div>

      <div style={diagStyles.card}>
        <div style={diagStyles.cardTitle}>Quadrilateral</div>
        <svg width="100" height="60" viewBox="0 0 100 60">
          <rect
            x="15"
            y="10"
            width="70"
            height="45"
            fill="#bee3f8"
            stroke="#2b6cb0"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div style={diagStyles.card}>
        <div style={diagStyles.cardTitle}>Pentagon</div>
        <svg width="100" height="60" viewBox="0 0 100 60">
          <polygon
            points="50,5 85,28 72,58 28,58 15,28"
            fill="#fbd38d"
            stroke="#c05621"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div style={diagStyles.card}>
        <div style={diagStyles.cardTitle}>Hexagon</div>
        <svg width="100" height="60" viewBox="0 0 100 60">
          <polygon
            points="50,5 80,20 80,45 50,58 20,45 20,20"
            fill="#e9d8fd"
            stroke="#553c9a"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  </div>
);

const diagStyles = {
  container: {
    backgroundColor: "#fffbeb",
    border: "2px solid #fcd34d",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "24px",
  },
  title: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1e1b4b",
    textAlign: "center",
    margin: "0 0 16px 0",
  },
  row: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    flexWrap: "wrap",
    overflowX: "hidden",
    maxWidth: "100%",
  },
  card: {
    backgroundColor: "white",
    border: "1.5px dashed #c7d2fe",
    borderRadius: "12px",
    padding: "10px",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#4f46e5",
    marginBottom: "6px",
  },
  inlineContainer: {
    backgroundColor: "#f8faff",
    border: "1.5px solid #c7d2fe",
    borderRadius: "12px",
    padding: "16px",
    margin: "12px 0",
    overflowX: "auto",
    maxWidth: "100%",
    WebkitOverflowScrolling: "touch",
    display: "block",
  },
};

// ============================================================
// DIAGRAM MAP
// ============================================================
const diagramMap = {
  "[DIAGRAM:tools]": <DiagramTools />,
  "[DIAGRAM:perpbisector]": <DiagramPerpBisector />,
  "[DIAGRAM:angles60]": <DiagramAngles60 />,
  "[DIAGRAM:symmetry]": <DiagramSymmetry />,
  "[DIAGRAM:ratio]": <DiagramRatio />,
  "[DIAGRAM:proportion]": <DiagramProportion />,
  "[DIAGRAM:equation]": <DiagramEquation />,
  "[DIAGRAM:perimeterarea]": <DiagramPerimeterArea />,
  "[DIAGRAM:bargraph]": <DiagramBarGraph />,
  "[DIAGRAM:pictograph]": <DiagramPictograph />,
  "[DIAGRAM:decimalplace]": <DiagramDecimalPlace />,
  "[DIAGRAM:fraction]": <DiagramFraction />,
  "[DIAGRAM:point]": <DiagramPoint />,
  "[DIAGRAM:lines]": <DiagramLines />,
  "[DIAGRAM:linetypes]": <DiagramLineTypes />,
  "[DIAGRAM:curves]": <DiagramCurves />,
  "[DIAGRAM:polygons]": <DiagramPolygons />,
  "[DIAGRAM:angles]": <DiagramAngles />,
  "[DIAGRAM:triangles]": <DiagramTriangles />,
  "[DIAGRAM:quadrilaterals]": <DiagramQuadrilaterals />,
  "[DIAGRAM:circle]": <DiagramCircle />,
};

function ReadingLesson() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  useEffect(() => {
    fetchLesson();
  }, []);

  const fetchLesson = async () => {
    try {
      const res = await API.get(`/chapters/${chapterId}/`);
      setChapter(res.data.chapter);
      const reading = res.data.lessons.find((l) => l.text_content);
      if (reading) setContent(reading.text_content);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = (text) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, index) => {
      // Chapter heading
      if (line.startsWith("📖")) {
        return (
          <div key={index} style={styles.chapterHeading}>
            {line}
          </div>
        );
      }
      // Topic heading
      if (line.startsWith("🔹")) {
        return (
          <div key={index} style={styles.topicHeading}>
            {line}
          </div>
        );
      }
      // Remember heading
      if (line.startsWith("⭐")) {
        return (
          <div key={index} style={styles.rememberHeading}>
            {line}
          </div>
        );
      }
      // Diagram markers — sirf Chapter 4 ke liye
      if (
        (chapterId === "4" ||
          chapterId === "5" ||
          chapterId === "7" ||
          chapterId === "8" ||
          chapterId === "9" ||
          chapterId === "10" ||
          chapterId === "11" ||
          chapterId === "12" ||
          chapterId === "13" ||
          chapterId === "14") &&
        diagramMap[line.trim()]
      ) {
        return <div key={index}>{diagramMap[line.trim()]}</div>;
      }
      // Normal line
      return (
        <div
          key={index}
          style={{
            ...styles.normalLine,
            fontSize: isMobile ? "15px" : "18px",
          }}
        >
          {line || "\u00A0"}
        </div>
      );
    });
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div
      style={{
        ...styles.container,
        overflowX: "hidden",
      }}
    >
      <nav
        style={{
          ...styles.navbar,
          padding: isMobile ? "0 16px" : "0px 40px",
        }}
      >
        {!isMobile && <h1 style={styles.navLogo}>🎮 MathQuest Arena</h1>}
        <button
          style={styles.backBtn}
          onClick={() => navigate(`/learning/${chapterId}`)}
        >
          ← Back
        </button>
      </nav>

      <div
        style={{
          ...styles.headerCard,
          padding: isMobile ? "24px 16px" : "50px 20px 40px",
          marginTop: isMobile ? "82px" : "60px",
        }}
      >
        <div style={styles.chapterBadge}>📖 Reading Lesson</div>
        <h2
          style={{
            ...styles.chapterTitle,
            fontSize: isMobile ? "22px" : "30px",
          }}
        >
          {chapter?.title}
        </h2>
        <p style={styles.chapterDesc}>
          Read carefully to understand all concepts!
        </p>
      </div>
      <div
        style={{
          ...styles.main,
          overflowX: "hidden",
        }}
      >
        {/* Top Overview — sirf Chapter 4 */}
        {chapterId === "4" && <GeometryDiagrams />}

        <div
          style={{
            ...styles.contentCard,
            padding: isMobile ? "16px" : "32px",
            overflowX: "hidden",
          }}
        >
          {content ? (
            <div style={styles.contentWrapper}>{renderContent(content)}</div>
          ) : (
            <div style={styles.noContent}>
              Reading content not available yet!
            </div>
          )}
        </div>

        <div
          style={{
            ...styles.bottomButtons,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <button
            style={styles.videoBtn}
            onClick={() => navigate(`/learning/${chapterId}/video`)}
          >
            📹 Switch to Video Mode
          </button>
          <button
            style={styles.quizBtn}
            onClick={() => navigate(`/quiz/${chapterId}/easy?from=reading`)}
          >
            🧠 Take Quiz Now
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    overflowX: "hidden",
  },
  navbar: {
    background: "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
    padding: "0px 40px",
    height: "82px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "fixed", // ← ADD KARO
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    boxShadow: "0 4px 15px rgba(99,102,241,0.2)",
  },
  navLogo: {
    color: "white",
    fontSize: "22px",
    fontWeight: "700",
    margin: 0,
  },
  backBtn: {
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    padding: "8px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "600",
    transition: "0.3s",
  },
  loading: {
    textAlign: "center",
    padding: "100px",
    color: "#6366f1",
    fontWeight: "600",
  },
  // main: { maxWidth: '900px', margin: '0 auto', padding: '32px 16px' },
  headerCard: {
    marginTop: "60px", // Navbar height ke barabar margin
    background: "linear-gradient(180deg, #bbdff7 0%, #ffffff 100%)",
    padding: "50px 20px 40px",
    textAlign: "center",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  chapterBadge: {
    backgroundColor: "#e0e7ff",
    color: "#4f46e5",
    padding: "4px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "800",
    marginBottom: "12px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  chapterTitle: {
    fontSize: "30px",
    color: "#1e293b",
    fontWeight: "800",
    margin: "0 0 8px 0",
  },
  chapterDesc: {
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "500",
    margin: 0,
  },
  main: { maxWidth: "900px", margin: "0 auto", padding: "32px 16px" },

  contentCard: {
    backgroundColor: "white",
    padding: "32px",
    borderRadius: "16px",
    marginBottom: "24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    minHeight: "300px",
  },
  contentWrapper: { fontFamily: "'Segoe UI', sans-serif" },
  chapterHeading: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#1e1b4b",
    marginBottom: "8px",
    marginTop: "4px",
  },
  topicHeading: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#4f46e5",
    marginTop: "20px",
    marginBottom: "8px",
  },
  rememberHeading: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#b45309",
    marginTop: "20px",
    marginBottom: "8px",
  },
  normalLine: {
    fontSize: "18px",
    lineHeight: "1.9",
    color: "#333",
    fontFamily: "inherit",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    overflowWrap: "break-word",
  },
  noContent: { textAlign: "center", color: "#666", padding: "40px" },
  bottomButtons: { display: "flex", gap: "16px" },
  videoBtn: {
    flex: 1,
    padding: "16px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #86efac",
    borderRadius: "15px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "700",
    color: "#053a19",
  },
  quizBtn: {
    flex: 1,
    padding: "16px",
    backgroundColor: "#eef2ff",
    border: "1px solid #c7d2fe",
    borderRadius: "15px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "700",
    color: "#211d68",
  },
};

export default ReadingLesson;
