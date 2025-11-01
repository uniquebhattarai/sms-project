import React, { useEffect, useState } from "react";
import { getUser, getPerformance } from "../../services/Apis";
import { FiPrinter, FiDownload, FiAward } from "react-icons/fi";

function ViewMarksheet() {
  const [student, setStudent] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUser();
        setStudent(userData.data);

        const perfData = await getPerformance(userData.data.id);
        setPerformance(perfData.data);
      } catch (error) {
        console.error("Error fetching marksheet:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Loading marksheet...</p>
      </div>
    );
  }

  if (!student || !performance) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-red-500">Failed to load marksheet data</p>
      </div>
    );
  }

  // Group marksheets by exam type
  const groupedByExam = performance.marksheets.reduce((acc, m) => {
    const exam = m.examtype.name;
    if (!acc[exam]) acc[exam] = [];
    acc[exam].push(m);
    return acc;
  }, {});

  

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Action Bar (not printed) */}
        <div className="mb-6 print:hidden relative flex items-center justify-center">
  <h1 className="text-3xl font-extrabold text-gray-800 tracking-wide">
    Academic Marksheet
  </h1>

  {/* Action Buttons */}
  <div className="absolute right-0 flex gap-3">
    <button
      onClick={() => window.print()}
      className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 shadow-md transition"
    >
      <FiPrinter className="w-4 h-4" />
      Print
    </button>
   
  </div>
</div>


        {/* Marksheet Container */}
        <div className="bg-white shadow-2xl rounded-xl overflow-hidden print:shadow-none print:rounded-none border border-gray-300">
          
          {/* School Header */}
          <div className="p-8 text-center border-b-4 border-greenn-700 bg-gradient-to-r from-blue-50 to-gray-50">
            <div className="w-16 h-16 mx-auto mb-4 border-2 border-green-700 rounded-full flex items-center justify-center bg-blue-100">
              <FiAward className="w-8 h-8 text-green-700" />
            </div>
            <h1 className="text-3xl font-bold mb-1 text-gray-800">XYZ Secondary School</h1>
            <p className="text-lg text-gray-600">Kathmandu, Nepal</p>
            <p className="mt-2 font-semibold text-xl text-green-700 underline">Official Marksheet</p>
          </div>

          {/* Student Info */}
          <div className="p-8 border-b border-gray-300 bg-gray-50">
            <div className="grid grid-cols-2 gap-6 text-lg">
              <div className="space-y-2">
                <p><span className="font-semibold text-gray-700">Full Name:</span> {student.full_name}</p>
                <p><span className="font-semibold text-gray-700">Email:</span> {student.email}</p>
                <p><span className="font-semibold text-gray-700">Student ID:</span> {student.id}</p>
              </div>
              <div className="space-y-2">
                <p><span className="font-semibold text-gray-700">Class:</span> {performance.marksheets[0]?.classlevel.level}</p>
                <p><span className="font-semibold text-gray-700">Total Subjects:</span> {performance.total_subjects}</p>
                <p><span className="font-semibold text-gray-700">Total Exams:</span> {performance.total_exams}</p>
              </div>
            </div>
          </div>

          {/* Exam Sections */}
          <div className="p-8 space-y-10">
            {Object.entries(groupedByExam).map(([examName, marks]) => {
              const examDate = marks[marks.length - 1]?.date; // last subject date
              return (
                <div key={examName}>
                  <h2 className="text-2xl font-bold text-center mb-4 text-green-700 underline">{examName}</h2>
                  <table className="w-full border-collapse border border-gray-700 text-lg">
                    <thead>
                      <tr className="bg-blue-50">
                        <th className="border border-gray-700 px-4 py-2">S.N.</th>
                        <th className="border border-gray-700 px-4 py-2">Subject</th>
                        <th className="border border-gray-700 px-4 py-2">Full Marks</th>
                        <th className="border border-gray-700 px-4 py-2">Obtained</th>
                        <th className="border border-gray-700 px-4 py-2">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marks.map((m, index) => {
                        const percentage = ((m.marks / m.full_marks) * 100).toFixed(1);
                        return (
                          <tr key={m.id} className="text-center hover:bg-blue-50 transition">
                            <td className="border border-gray-700 px-4 py-2">{index + 1}</td>
                            <td className="border border-gray-700 px-4 py-2 text-left">{m.subject.name}</td>
                            <td className="border border-gray-700 px-4 py-2">{m.full_marks}</td>
                            <td className="border border-gray-700 px-4 py-2 font-semibold text-green-700">{m.marks}</td>
                            <td className="border border-gray-700 px-4 py-2">{percentage}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <p className="mt-3 text-sm text-gray-600 text-right">
                    Exam Date: {examDate}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Summary Section */}
          <div className="p-8 border-t-2 border-green-700 text-lg bg-gray-50">
            <p>Average Percentage: <span className="font-bold text-blue-700">{performance.average_percentage}%</span></p>
            <p>Result: <span className={`font-bold ${performance.average_percentage >= 40 ? "text-green-600" : "text-red-600"}`}>
              {performance.average_percentage >= 40 ? "PASS" : "FAIL"}
            </span></p>
          </div>

          {/* Signatures */}
          <div className="p-8 border-t border-gray-300">
            <div className="grid grid-cols-3 text-center mt-10">
              <div>
                <p className="border-t-2 border-gray-700 inline-block px-6">Class Teacher</p>
              </div>
              <div>
                <p className="border-t-2 border-gray-700 inline-block px-6">Principal</p>
              </div>
              <div>
                <p className="border-t-2 border-gray-700 inline-block px-6">Exam Controller</p>
              </div>
            </div>
            <div className="text-center mt-6 text-sm text-gray-500">
              Generated on {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body { margin: 0; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:rounded-none { border-radius: 0 !important; }
        }
      `}</style>
    </div>
  );
}

export default ViewMarksheet;
