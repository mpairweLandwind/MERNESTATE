import prisma from '../lib/prisma.mjs';


export const createMaintenance = async (req, res) => {
    console.log('Request Body:', req.body);
  
    const { maintenanceData, maintenanceHistory } = req.body;

    // Convert dates to ISO-8601 format
    maintenanceData.lastRenovationDate = new Date(maintenanceData.lastRenovationDate).toISOString();
    if (maintenanceHistory) {
        maintenanceHistory.date = new Date(maintenanceHistory.date).toISOString();
    }
  
    // Log incoming request data for debugging
    console.log('Received maintenanceData:', maintenanceData);
    console.log('Received maintenanceHistory:', maintenanceHistory);
    console.log('User:', req.user);
  
    // Check if required fields are present
    if (!maintenanceData || !maintenanceData.name || !maintenanceData.type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    try {
      const userId = req.user.id; // Extract user ID from the verified token
  
      const maintenance = await prisma.maintenance.create({
        data: {
          ...maintenanceData,
          lastRenovationDate: new Date(maintenanceData.lastRenovationDate),
          userRef: userId, // Reference the user ID from the request object
          maintenanceHistory: maintenanceHistory
            ? { create: maintenanceHistory }
            : undefined,
        },
        select: {
          id: true,
          name: true,
          // Add other fields as necessary
        },
      });
  
      res.status(201).json({
        success: true,
        message: 'Maintenance created successfully',
        _id: maintenance.id,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create maintenance', error: error.message });
    }
  };

export const getMaintenance = async (req, res) => {

  const { id } = req.params;

  // Check if the ID parameter is provided
  if (!id) {
    return res.status(400).json({ error: 'ID parameter is required' });
  }

  try {
    const maintenance = await prisma.maintenance.findUnique({
      where: { id: req.params.id },
      include: { 
        maintenanceHistory: true ,
        user: {
          select: {            
            username: true,
            avatar: true,           
          }
        }
      },
    });
    res.status(200).json(maintenance);
    console.log(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMaintenance = async (req, res) => {
  try {
    // Log the received data for debugging
    console.log('Received data:', req.body);

    // Find the maintenance record by its ID
    const maintenance = await prisma.maintenance.findUnique({
      where: { id: req.params.id },
    });

    // Check if the maintenance record exists
    if (!maintenance) {
      return res.status(404).json({ message: 'Record not found!' });
    }

    // Verify that the user is authorized to update the record
    if (req.user.id !== maintenance.userRef) {
      return res.status(401).json({ message: 'You can only update your own record!' });
    }

    // Destructure req.body to exclude nested objects and immutable fields
    const { id, maintenanceHistory, user, createdAt, ...updateData } = req.body;

    // Convert string fields to appropriate types if necessary
    if (updateData.latitude) {
      updateData.latitude = parseFloat(updateData.latitude);
    }
    if (updateData.lastRenovationDate) {
      updateData.lastRenovationDate = new Date(updateData.lastRenovationDate).toISOString();
    }
    

    if (updateData.longitude) {
      updateData.longitude = parseFloat(updateData.longitude);
    }
    if (updateData.size) {
      updateData.size = parseFloat(updateData.size);
    }
    if (updateData.estimatedValue) {
      updateData.estimatedValue = parseFloat(updateData.estimatedValue);
    }
    if (updateData.maintenanceCharge) {
      updateData.maintenanceCharge = parseFloat(updateData.maintenanceCharge);
    }
    if (updateData.yearBuilt) {
      updateData.yearBuilt = parseFloat(updateData.yearBuilt);
    }

    // Log the update data for debugging
    console.log('Update data:', updateData);

    // Update the maintenance record with the non-nested data provided
    const updatedMaintenance = await prisma.maintenance.update({
      where: { id: req.params.id },
      data: updateData,
    });
      console.log('Updated maintenance:', updatedMaintenance.id);
      console.log('Updated successfully');
    // Return the id of the updated maintenance record and a success message
    res.status(200).json({ id: updatedMaintenance.id, message: 'Updated successfully' });
    
  } catch (error) {
    // Log the error for debugging
    console.error('Error updating maintenance:', error);

    // Handle errors and return a 500 status code
    res.status(500).json({ message: error.message });
  }
};




export const deleteMaintenance = async (req, res) => {
  try {
    await prisma.maintenance.delete({
      where: { id: req.params.id },
    });
    res.status(204).json({ message: 'Maintenance deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
