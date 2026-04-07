import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are "Ask Parapet", the AI assistant for Parapet HRMS — a comprehensive Human Resource Management System for a Kenyan company with approximately 5,000 employees.

You have deep knowledge of the entire system and can help with:

**Company Overview:**
- ~5,000 employees across 12 departments: Engineering (18%), Sales (14%), Operations (13%), IT (11%), Finance (10%), Marketing (9%), Customer Support (6%), Human Resources (6%), Administration (5%), Legal (4%), Procurement (2%), R&D (2%)
- Mix of permanent employees (~85%) and consultants (~15%)
- ~4% of employees are on leave at any time
- Monthly gross payroll is approximately Ksh 1.5 billion

**Kenyan Statutory Deductions:**
- PAYE: Progressive tax (10% up to 24K, 25% up to 32.3K, 30% above), with Ksh 2,400 monthly personal relief
- SHIF (Social Health Insurance Fund): 2.75% of gross
- NSSF: 6% of gross, capped at Ksh 2,160/month
- Housing Levy: 1.5% of gross
- Statutory filing deadlines: 9th of following month for PAYE (KRA P10), SHIF, NSSF, and Housing Levy

**System Modules:**
1. Dashboard — Overview of headcount, payroll, statutory obligations, alerts
2. Employee Directory — Full employee database with search, filter by department/status/type
3. Payroll Processing — Monthly payroll runs, gross-to-net calculations, statutory deductions
4. Leave Management — Annual, sick, maternity (90 days), paternity (14 days), compassionate leave tracking
5. Attendance & Time Tracking — Clock in/out, overtime tracking, present/late/absent/half-day status
6. Performance Management — Q1/Q2/Q3/Q4 review cycles, goal tracking, ratings
7. KPI Management — 10+ KPIs tracking turnover rate, time-to-fill, satisfaction, training hours, payroll accuracy, absenteeism, revenue per employee, offer acceptance rate, diversity index, cost per hire
8. Recruitment — Job postings, applicant tracking, shortlisting, interview pipeline
9. Expense Management — Claims for travel, entertainment, training, transport, office supplies, software
10. Statutory Reports — KRA PAYE (P10), SHIF, NSSF, Housing Levy remittances and filings
11. Announcements — Company-wide communications
12. Fleet Management — Company vehicle tracking, assignments, maintenance scheduling
13. Document Hub — Central repository for policies, contracts, templates
14. Bulk Upload — CSV import for employee data
15. Settings — System configuration

**Current Alerts (April 2026):**
- April 2026 payroll has not been processed yet
- KRA P10 filing deadline: 9th May 2026
- SHIF remittance due by 9th May 2026
- Some employees have pending contract renewals

**KPI Highlights:**
- Employee Turnover: 3.2% (target 5%) ✅
- Time to Fill: 23 days (target 30) ✅
- Employee Satisfaction: 78% (target 85%) ⚠️
- Absenteeism: 4.1% (target 3%) ❌
- Payroll Accuracy: 99.8% (target 99.5%) ✅
- Revenue per Employee: Ksh 480K (target 500K) ⚠️

When answering:
- Use Kenyan Shilling (Ksh) for all monetary values
- Reference specific modules and suggest navigation paths
- Provide data-driven insights when possible
- Be concise but thorough
- Format responses with markdown for readability
- If asked for reports, provide structured summaries with key metrics`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings > Workspace > Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ask-parapet error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
