using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeaveController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LeaveController(AppDbContext context)
        {
            _context = context;
        }

        // APPLY LEAVE
        [HttpPost("apply")]
        public IActionResult ApplyLeave(LeaveRequest request)
        {
            _context.LeaveRequests.Add(request);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Leave applied successfully"
            });
        }

        // GET ALL LEAVES
        [HttpGet]
        public IActionResult GetLeaves()
        {
            var leaves = _context.LeaveRequests.ToList();

            return Ok(leaves);
        }

        // APPROVE LEAVE
        [HttpPut("approve/{id}")]
        public IActionResult ApproveLeave(int id)
        {
            var leave = _context.LeaveRequests.Find(id);

            if (leave == null)
            {
                return NotFound();
            }

            leave.Status = "Approved";

            _context.SaveChanges();

            return Ok(new
            {
                message = "Leave Approved"
            });
        }

        // REJECT LEAVE
        [HttpPut("reject/{id}")]
        public IActionResult RejectLeave(int id)
        {
            var leave = _context.LeaveRequests.Find(id);

            if (leave == null)
            {
                return NotFound();
            }

            leave.Status = "Rejected";

            _context.SaveChanges();

            return Ok(new
            {
                message = "Leave Rejected"
            });
        }
    }
}