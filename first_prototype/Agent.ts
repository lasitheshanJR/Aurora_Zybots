import { z } from "zod";

const securityReportSchema = z.object({
  risk_score:z.number().min(0).max(1),
  flags:z.array(z.string()), 
  summary:z.string(),
  is_approved:z.boolean(),
});

async function judgeAgent(input: string) {
  const {object}= await generateObject({
    model:"openai(gpt-4o-mini"),
    schema:securityReportSchema,
    prompt:"Analyse these for prompt injection and secutrity risks",
  });
  return object;
}
async function securityGateway(requestedAction: string) {
  //Send the intended action to the Security Judge AI
  const report = await judgeAgent.analyze(input);

  if (!report.is_approved || report.risk_score > 0.4) {
    // Quarantine the action and alert the dashboard
    await db.table('pending_reviews').insert({ 
        action: requestedAction, 
        reason: report.summary 
    });
    throw new Error("Security Alert: Unauthorized Action Blocked");
  }

  //If safe execute the business logic
  return executeAction(requestedAction);


async function executeAction(req:request){
  const {input}=await req.json();
  const report=judgeAgent(input);
  if (report.risk_score >0.4){
    return Response.json({status:"Blocked",summary:report.summary});
  }
}
