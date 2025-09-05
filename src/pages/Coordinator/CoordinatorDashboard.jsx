import React, { useEffect, useState } from "react";
import { Container, Row, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Import Bootstrap icons
import { PeopleFill, PersonLinesFill, BookFill, CheckCircleFill } from "react-bootstrap-icons";

const CoordinatorDashboard = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [departments, setDepartments] = useState([]);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios.get("https://localhost:7145/Coordinator/ViewTeachers", config)
      .then(res => setTeachers(res.data.slice(0, 3)))
      .catch(err => console.error("Error fetching teachers:", err));

    axios.get("https://localhost:7145/Coordinator/ViewStudents", config)
      .then(res => setStudents(res.data.slice(0, 3)))
      .catch(err => console.error("Error fetching students:", err));

    axios.get("https://localhost:7145/Coordinator/ViewEnrolledStudents", config)
      .then(res => setEnrolledStudents(res.data.slice(0, 3)))
      .catch(err => console.error("Error fetching enrolled students:", err));

    const fetchAssignedCoursesWithDetails = async () => {
      try {
        const [
          assignedResponse,
          courseResponse,
          teacherResponse,
          dropdownResponse
        ] = await Promise.all([
          axios.get("https://localhost:7145/Coordinator/ViewAllAssignedCoursesToTeachers", config),
          axios.get("https://localhost:7145/Coordinator/ViewCourses", config),
          axios.get("https://localhost:7145/Coordinator/ViewTeachers", config),
          axios.get("https://localhost:7145/Coordinator/GetStudentDropdowns", config),
        ]);

        const coursesData = courseResponse.data || [];
        const teachersData = teacherResponse.data || [];
        const departmentsData = dropdownResponse.data.departments || [];

        const mappedAssignedCourses = assignedResponse.data.map(assignment => {
          const course = coursesData.find(c => c.courseId === assignment.courseId);
          const teacher = teachersData.find(t => t.teacherId === assignment.teacherId);
          const department = departmentsData.find(d => d.departmentId === (course?.departmentId || ""));

          return {
            courseOfferingId: assignment.courseOfferingId,
            courseId: assignment.courseId,
            teacherId: assignment.teacherId,
            semester: assignment.semester,
            courseTitle: course?.courseTitle || `Course_${assignment.courseId.slice(0, 8)}`,
            teacherName: teacher && teacher.firstName && teacher.lastName
              ? `${teacher.firstName} ${teacher.lastName}`
              : teacher?.firstName || teacher?.lastName || `Teacher_${assignment.teacherId.slice(0, 8)}`,
            departmentName: department?.departmentName || "N/A"
          };
        });

        setAssignedCourses(mappedAssignedCourses.slice(0, 3));
      } catch (error) {
        console.error("Error fetching assigned courses or related data:", error);
      }
    };

    fetchAssignedCoursesWithDetails();
  }, [navigate, token]);
 console.log("Enrolled Students:", enrolledStudents);
  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">Coordinator Dashboard</h2>

      {/* Teachers */}
      <Section
        title="Manage Instructors"
        icon={<PeopleFill className="me-2 text-primary" />}
        items={teachers}
        renderItem={(teacher, idx) => (
          <Card key={idx} className="mb-3 shadow-sm border-primary">
            <Card.Body>
              <Card.Title className="d-flex align-items-center">
                <PeopleFill className="me-2 text-primary" />
                {teacher.firstName} {teacher.lastName}
              </Card.Title>
              <Card.Text>
                <i className="bi bi-envelope-fill me-2"></i>Email: {teacher.email}
              </Card.Text>
            </Card.Body>
          </Card>
        )}
        onViewAll={() => navigate("/coordinator/view-instructors")}
      />

      {/* Students */}
      <Section
        title="Manage Students"
        icon={<PersonLinesFill className="me-2 text-success" />}
        items={students}
        renderItem={(student, idx) => (
          <Card key={idx} className="mb-3 shadow-sm border-success">
            <Card.Body>
              <Card.Title className="d-flex align-items-center">
                <PersonLinesFill className="me-2 text-success" />
                {student.firstName} {student.lastName}
              </Card.Title>
              <Card.Text>
                <i className="bi bi-envelope-fill me-2"></i>Email: {student.email}
              </Card.Text>
            </Card.Body>
          </Card>
        )}
        onViewAll={() => navigate("/coordinator/view-students")}
      />

      {/* Assigned Courses */}
      <Section
        title="Manage Courses"
        icon={<BookFill className="me-2 text-warning" />}
        items={assignedCourses}
        renderItem={(course, idx) => (
          <Card key={idx} className="mb-3 shadow-sm border-warning">
            <Card.Body>
              <Card.Title className="d-flex align-items-center">
                <BookFill className="me-2 text-warning" />
                {course.courseTitle}
              </Card.Title>
              <Card.Text>
                <strong>Assigned to:</strong> {course.teacherName} <br />
                <strong>Department:</strong> {course.departmentName} <br />
                <strong>Semester:</strong> {course.semester}
              </Card.Text>
            </Card.Body>
          </Card>
        )}
        onViewAll={() => navigate("/coordinator/view-assigned-courses")}
      />

      





    </Container>
  );
};

const Section = ({ title, icon, items, renderItem, onViewAll }) => (
  <>
    <h4 className="mb-3 d-flex align-items-center">
      {icon}
      {title}
    </h4>
    {items.length === 0 ? (
      <p className="text-muted">No data available.</p>
    ) : (
      <Row xs={1} md={3} className="g-3 mb-3">
        {items.map(renderItem)}
      </Row>
    )}
    <div className="d-flex justify-content-center mb-5">
      <Button variant="dark" onClick={onViewAll}>
        View All
      </Button>
    </div>
  </>
);

export default CoordinatorDashboard;
