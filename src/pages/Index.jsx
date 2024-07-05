import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { parse } from "json2csv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchEvents, createEvent, updateEvent, deleteEvent } from "@/integrations/supabase/index.js";

const Index = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const events = await fetchEvents();
        setHeaders(Object.keys(events[0]));
        setData(events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    loadEvents();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setHeaders(Object.keys(results.data[0]));
          setData(results.data);
        },
      });
    }
  };

  const handleCellChange = (rowIndex, column, value) => {
    const updatedData = [...data];
    updatedData[rowIndex][column] = value;
    setData(updatedData);
  };

  const handleAddRow = async () => {
    const newRow = headers.reduce((acc, header) => {
      acc[header] = "";
      return acc;
    }, {});
    try {
      const createdEvent = await createEvent(newRow);
      setData([...data, createdEvent[0]]);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleRemoveRow = async (rowIndex) => {
    const eventId = data[rowIndex].id;
    try {
      await deleteEvent(eventId);
      const updatedData = data.filter((_, index) => index !== rowIndex);
      setData(updatedData);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleDownload = () => {
    const csv = parse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "edited_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">CSV Upload, Edit, and Download Tool</h1>
      <Input type="file" accept=".csv" onChange={handleFileUpload} className="mb-4" />
      {data.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header) => (
                    <TableCell key={header}>
                      <Input
                        value={row[header]}
                        onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleRemoveRow(rowIndex)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={handleAddRow} className="mt-4">
            Add Row
          </Button>
          <Button onClick={handleDownload} className="mt-4 ml-2">
            Download CSV
          </Button>
        </>
      )}
    </div>
  );
};

export default Index;