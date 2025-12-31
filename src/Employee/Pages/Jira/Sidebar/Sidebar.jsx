
import React, { useState } from "react";
import {
  FiClock,
  FiStar,
  FiGrid,
  FiGlobe,
  FiFileText,
  FiFilter,
  FiBarChart2,
  FiCpu,
  FiChevronRight,
  FiChevronDown,
  FiMoreHorizontal,
  FiSearch,
  FiPlus,
} from "react-icons/fi";
import "./Sidebar.css";

const Sidebar = () => {
  const [showMore, setShowMore] = useState(true);

  return (
    <aside className="jira2-sidebar">
      {/* Header / For you */}
      <div className="jira2-header">
        <div className="jira2-title">For you</div>
        <div className="jira2-actions">
          <button className="jira2-iconbtn" aria-label="More actions">
            <FiMoreHorizontal />
          </button>
          <button className="jira2-iconbtn" aria-label="Create">
            <FiPlus />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="jira2-search">
        <FiSearch className="jira2-search-icon" />
        <input
          type="text"
          placeholder="Search"
          className="jira2-search-input"
        />
      </div>

      <nav className="jira2-nav">
        {/* Spaces */}
        <SectionHeader label="Spaces" />

        {/* Starred */}
        <SubHeader label="Starred" />
        <NavItem
          icon={<FiGlobe />}
          label="(Example) Billing System"
          avatar="🪐"
          muted
        />

        {/* Recent */}
        <SubHeader label="Recent" />
        <NavItem
          icon={<span className="jira2-emoji">🧩</span>}
          label="My Software Team"
          active
          pillRight={<Chevron label="More spaces" />}
        />

       

        {/* More (dropdown-like) */}
        <div className="jira2-more-wrapper">
          <button
            className={`jira2-more ${showMore ? "open" : ""}`}
            onClick={() => setShowMore((s) => !s)}
            aria-expanded={showMore}
          >
            <FiMoreHorizontal className="jira2-more-icon" />
            <span>More</span>
            {showMore ? (
              <FiChevronDown className="jira2-caret" />
            ) : (
              <FiChevronRight className="jira2-caret" />
            )}
          </button>

          {showMore && (
            <div className="jira2-more-menu">
              <NavItem icon={<FiClock />} label="Recent" variant="menu" />
              <NavItem icon={<FiStar />} label="Starred" variant="menu" />
              <NavItem icon={<FiGrid />} label="Apps" variant="menu" />
              <NavItem icon={<FiGlobe />} label="Overviews" variant="menu" />
              <NavItem icon={<FiFileText />} label="Plans" variant="menu" />
              <NavItem icon={<FiFilter />} label="Filters" variant="menu" />
              <NavItem
                icon={<FiBarChart2 />}
                label="Dashboards"
                variant="menu"
              />
              <NavItem icon={<FiCpu />} label="Operations" variant="menu" />
            </div>
          )}
        </div>
      </nav>

      {/* Footer / Feedback */}
      <div className="jira2-footer">
        <button className="jira2-feedback">Give feedback on the navigation</button>
      </div>
    </aside>
  );
};

/* ---------- Helper Components ---------- */

const SectionHeader = ({ label }) => (
  <div className="jira2-section-header">{label}</div>
);

const SubHeader = ({ label }) => (
  <div className="jira2-subheader">{label}</div>
);

const Tag = ({ label }) => <span className="jira2-tag">{label}</span>;

const Chevron = ({ label }) => (
  <span className="jira2-right-chev">
    {label} <FiChevronRight />
  </span>
);

const NavItem = ({
  icon,
  label,
  active = false,
  muted = false,
  rightTag = null,
  pillRight = null,
  variant = "default",
  avatar = null,
}) => {
  const classes = [
    "jira2-item",
    active ? "active" : "",
    muted ? "muted" : "",
    variant === "menu" ? "menu" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes}>
      <div className="jira2-left">
        <div className="jira2-icon">{icon}</div>
        {avatar && <div className="jira2-avatar">{avatar}</div>}
        <span className="jira2-label">{label}</span>
      </div>
      <div className="jira2-right">
        {pillRight}
        {rightTag}
      </div>
    </button>
  );
};

export default Sidebar;