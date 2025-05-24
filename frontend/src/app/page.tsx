export default function Dashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Welcome Section */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "1rem",
          boxShadow: "var(--shadow-md)",
          padding: "1.5rem",
        }}
      >
        <h1
          style={{
            fontSize: "1.875rem",
            fontWeight: "bold",
            color: "var(--font-primary-color)",
            marginBottom: "1rem",
            margin: "0 0 1rem 0",
          }}
        >
          Welcome to VSME Reporting
        </h1>
        <p
          style={{
            color: "var(--font-primary-color-light)",
            fontSize: "1.125rem",
            margin: 0,
          }}
        >
          Complete your sustainability report by navigating through the sections in the sidebar.
        </p>
      </div>

      {/* Quick Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "var(--border-radius)",
            padding: "1.5rem",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p
                style={{
                  color: "var(--font-primary-color-light)",
                  fontSize: "0.875rem",
                  margin: "0 0 0.5rem 0",
                }}
              >
                Sections Completed
              </p>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "var(--font-primary-color)",
                  margin: 0,
                }}
              >
                0 / 4
              </p>
            </div>
            <div
              style={{
                backgroundColor: "var(--primary-color-light)",
                borderRadius: "50%",
                padding: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                style={{ width: "1.5rem", height: "1.5rem", color: "var(--primary-color)" }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "var(--border-radius)",
            padding: "1.5rem",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p
                style={{
                  color: "var(--font-primary-color-light)",
                  fontSize: "0.875rem",
                  margin: "0 0 0.5rem 0",
                }}
              >
                Report Status
              </p>
              <p
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: "var(--font-primary-color)",
                  margin: 0,
                }}
              >
                In Progress
              </p>
            </div>
            <div
              style={{
                backgroundColor: "var(--primary-color-light)",
                borderRadius: "50%",
                padding: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                style={{ width: "1.5rem", height: "1.5rem", color: "var(--primary-color)" }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "var(--border-radius)",
            padding: "1.5rem",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p
                style={{
                  color: "var(--font-primary-color-light)",
                  fontSize: "0.875rem",
                  margin: "0 0 0.5rem 0",
                }}
              >
                Last Updated
              </p>
              <p
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: "var(--font-primary-color)",
                  margin: 0,
                }}
              >
                Today
              </p>
            </div>
            <div
              style={{
                backgroundColor: "var(--primary-color-light)",
                borderRadius: "50%",
                padding: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                style={{ width: "1.5rem", height: "1.5rem", color: "var(--primary-color)" }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "var(--border-radius)",
            padding: "1.5rem",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p
                style={{
                  color: "var(--font-primary-color-light)",
                  fontSize: "0.875rem",
                  margin: "0 0 0.5rem 0",
                }}
              >
                Next Section
              </p>
              <p
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: "var(--font-primary-color)",
                  margin: 0,
                }}
              >
                General Info
              </p>
            </div>
            <div
              style={{
                backgroundColor: "var(--primary-color-light)",
                borderRadius: "50%",
                padding: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                style={{ width: "1.5rem", height: "1.5rem", color: "var(--primary-color)" }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Quick Start */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "1rem",
            boxShadow: "var(--shadow-md)",
            padding: "1.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "var(--font-primary-color)",
              marginBottom: "1rem",
              margin: "0 0 1rem 0",
            }}
          >
            Quick Start
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.75rem",
                backgroundColor: "var(--primary-color-light)",
                borderRadius: "var(--border-radius)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: "2.5rem",
                  height: "2.5rem",
                  backgroundColor: "var(--primary-color)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <svg style={{ width: "1.25rem", height: "1.25rem" }} fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 style={{ fontWeight: "500", margin: "0 0 0.25rem 0", color: "var(--font-primary-color)" }}>
                  Start General Information
                </h3>
                <p style={{ fontSize: "0.875rem", opacity: 0.8, margin: 0, color: "var(--font-primary-color-light)" }}>
                  Begin with company basics
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.75rem",
                backgroundColor: "#f9fafb",
                borderRadius: "var(--border-radius)",
                opacity: 0.6,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: "2.5rem",
                  height: "2.5rem",
                  backgroundColor: "#d1d5db",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  style={{ width: "1.25rem", height: "1.25rem", color: "#6b7280" }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 style={{ fontWeight: "500", margin: "0 0 0.25rem 0", color: "#6b7280" }}>Environmental Section</h3>
                <p style={{ fontSize: "0.875rem", margin: 0, color: "#9ca3af" }}>Complete General Information first</p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.75rem",
                backgroundColor: "#f9fafb",
                borderRadius: "var(--border-radius)",
                opacity: 0.6,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: "2.5rem",
                  height: "2.5rem",
                  backgroundColor: "#d1d5db",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  style={{ width: "1.25rem", height: "1.25rem", color: "#6b7280" }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 style={{ fontWeight: "500", margin: "0 0 0.25rem 0", color: "#6b7280" }}>Social & Governance</h3>
                <p style={{ fontSize: "0.875rem", margin: 0, color: "#9ca3af" }}>Complete previous sections first</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "1rem",
            boxShadow: "var(--shadow-md)",
            padding: "1.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "var(--font-primary-color)",
              marginBottom: "1rem",
              margin: "0 0 1rem 0",
            }}
          >
            Recent Activity
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.75rem",
                borderLeft: "4px solid var(--primary-color)",
                backgroundColor: "rgba(2, 119, 189, 0.05)",
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <div
                  style={{
                    width: "0.5rem",
                    height: "0.5rem",
                    backgroundColor: "var(--primary-color)",
                    borderRadius: "50%",
                  }}
                ></div>
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "var(--font-primary-color)",
                    margin: "0 0 0.25rem 0",
                  }}
                >
                  Report created
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--font-primary-color-light)", margin: 0 }}>Just now</p>
              </div>
            </div>

            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <svg
                style={{
                  width: "3rem",
                  height: "3rem",
                  color: "var(--font-primary-color-lightest)",
                  margin: "0 auto 1rem",
                }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                  clipRule="evenodd"
                />
              </svg>
              <p style={{ color: "var(--font-primary-color-light)", fontSize: "0.875rem", margin: "0 0 0.25rem 0" }}>
                No recent activity
              </p>
              <p style={{ color: "var(--font-primary-color-lightest)", fontSize: "0.75rem", margin: 0 }}>
                Start completing sections to see updates
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action
      <div
        style={{
          background: "linear-gradient(135deg, var(--primary-color), rgba(2, 119, 189, 0.8))",
          borderRadius: "1rem",
          boxShadow: "var(--shadow-md)",
          padding: "2rem",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem", margin: "0 0 0.5rem 0" }}>
              Ready to get started?
            </h2>
            <p style={{ color: "rgba(255, 255, 255, 0.9)", margin: 0 }}>
              Begin your sustainability reporting journey with the General Information section.
            </p>
          </div>
          <button
            style={{
              backgroundColor: "white",
              color: "var(--primary-color)",
              padding: "0.75rem 1.5rem",
              borderRadius: "var(--border-radius)",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
            }}
          >
            Start Report
          </button>
        </div> 
      </div>*/}
    </div>
  );
}
