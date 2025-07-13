import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { Image, Upload, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Clock } from 'lucide-react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function GalleryScreen() {
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Required',
          'We need access to your photo library to select crop images for analysis.'
        );
        return;
      }

      setIsUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        // Simulate upload and processing
        setTimeout(() => {
          setIsUploading(false);
          Alert.alert(
            'Image Uploaded!',
            'Your crop image has been uploaded successfully. Processing for analysis...',
            [
              { text: 'View Analysis', onPress: () => router.push('/analysis') },
              { text: 'Upload Another', style: 'cancel' }
            ]
          );
        }, 2000);
      } else {
        setIsUploading(false);
      }
    } catch (error) {
      setIsUploading(false);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Mock recent uploads data
  const recentUploads = [
    {
      id: 1,
      name: 'Tomato Plant - Field A',
      date: '2 hours ago',
      status: 'analyzed',
      health: 'healthy',
    },
    {
      id: 2,
      name: 'Wheat Crop - Section B',
      date: '1 day ago',
      status: 'analyzed',
      health: 'warning',
    },
    {
      id: 3,
      name: 'Corn Field - Plot C',
      date: '3 days ago',
      status: 'processing',
      health: null,
    },
  ];

  const getStatusIcon = (status: string, health: string | null) => {
    if (status === 'processing') {
      return <Clock size={20} color="#FF9800" />;
    }
    if (health === 'healthy') {
      return <CheckCircle size={20} color="#4CAF50" />;
    }
    return <AlertCircle size={20} color="#FF5722" />;
  };

  const getStatusColor = (status: string, health: string | null) => {
    if (status === 'processing') return '#FF9800';
    if (health === 'healthy') return '#4CAF50';
    return '#FF5722';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Photo Gallery</Text>
        <Text style={styles.headerSubtitle}>Upload and manage crop images</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.uploadCard, isUploading && styles.uploadCardDisabled]}
          onPress={pickImage}
          disabled={isUploading}
        >
          <View style={styles.uploadIcon}>
            <Upload size={32} color={isUploading ? '#999' : '#4CAF50'} />
          </View>
          <Text style={[styles.uploadTitle, isUploading && styles.uploadTitleDisabled]}>
            {isUploading ? 'Uploading...' : 'Select from Gallery'}
          </Text>
          <Text style={[styles.uploadDescription, isUploading && styles.uploadDescriptionDisabled]}>
            {isUploading 
              ? 'Processing your image for analysis...'
              : 'Choose an existing photo from your device'
            }
          </Text>
          {isUploading && (
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Uploads</Text>
          {recentUploads.map((upload) => (
            <TouchableOpacity
              key={upload.id}
              style={styles.uploadItem}
              onPress={() => router.push('/analysis')}
            >
              <View style={styles.uploadItemLeft}>
                <View style={[styles.uploadItemIcon, { backgroundColor: getStatusColor(upload.status, upload.health) + '20' }]}>
                  <Image size={20} color={getStatusColor(upload.status, upload.health)} />
                </View>
                <View style={styles.uploadItemText}>
                  <Text style={styles.uploadItemName}>{upload.name}</Text>
                  <Text style={styles.uploadItemDate}>{upload.date}</Text>
                </View>
              </View>
              <View style={styles.uploadItemRight}>
                {getStatusIcon(upload.status, upload.health)}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Upload Guidelines</Text>
          <View style={styles.infoItem}>
            <CheckCircle size={16} color="#4CAF50" />
            <Text style={styles.infoText}>Use high-resolution images (minimum 1MP)</Text>
          </View>
          <View style={styles.infoItem}>
            <CheckCircle size={16} color="#4CAF50" />
            <Text style={styles.infoText}>Ensure good lighting and focus</Text>
          </View>
          <View style={styles.infoItem}>
            <CheckCircle size={16} color="#4CAF50" />
            <Text style={styles.infoText}>Capture the affected area clearly</Text>
          </View>
          <View style={styles.infoItem}>
            <CheckCircle size={16} color="#4CAF50" />
            <Text style={styles.infoText}>Supported formats: JPG, PNG</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  uploadCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#E8F5E8',
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadCardDisabled: {
    opacity: 0.6,
  },
  uploadIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  uploadTitleDisabled: {
    color: '#999',
  },
  uploadDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  uploadDescriptionDisabled: {
    color: '#999',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 15,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    width: '60%',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  uploadItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  uploadItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  uploadItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  uploadItemText: {
    flex: 1,
  },
  uploadItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  uploadItemDate: {
    fontSize: 12,
    color: '#666',
  },
  uploadItemRight: {
    marginLeft: 10,
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },
});