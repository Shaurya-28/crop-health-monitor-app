import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Leaf, Droplets, Sun, Bug, TrendingUp, Clock } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AnalysisScreen() {
  const [selectedAnalysis, setSelectedAnalysis] = useState(0);

  // Mock analysis data
  const analyses = [
    {
      id: 1,
      cropName: 'Tomato Plant',
      timestamp: '2 hours ago',
      overallHealth: 85,
      status: 'healthy',
      issues: [
        {
          type: 'Early Blight',
          severity: 'Low',
          confidence: 78,
          icon: AlertTriangle,
          color: '#FF9800',
          description: 'Minor fungal infection detected on lower leaves',
          recommendation: 'Apply copper-based fungicide and improve air circulation'
        }
      ],
      metrics: [
        { label: 'Leaf Health', value: 88, icon: Leaf, color: '#4CAF50' },
        { label: 'Water Stress', value: 15, icon: Droplets, color: '#2196F3' },
        { label: 'Sun Exposure', value: 92, icon: Sun, color: '#FF9800' },
        { label: 'Pest Risk', value: 25, icon: Bug, color: '#9C27B0' },
      ]
    },
    {
      id: 2,
      cropName: 'Wheat Field',
      timestamp: '1 day ago',
      overallHealth: 72,
      status: 'warning',
      issues: [
        {
          type: 'Rust Disease',
          severity: 'Medium',
          confidence: 89,
          icon: AlertTriangle,
          color: '#FF5722',
          description: 'Rust spores detected on multiple plants',
          recommendation: 'Apply appropriate fungicide treatment immediately'
        }
      ],
      metrics: [
        { label: 'Leaf Health', value: 65, icon: Leaf, color: '#FF9800' },
        { label: 'Water Stress', value: 45, icon: Droplets, color: '#FF5722' },
        { label: 'Sun Exposure', value: 88, icon: Sun, color: '#4CAF50' },
        { label: 'Pest Risk', value: 60, icon: Bug, color: '#FF5722' },
      ]
    }
  ];

  const currentAnalysis = analyses[selectedAnalysis];

  const getHealthColor = (health: number) => {
    if (health >= 80) return '#4CAF50';
    if (health >= 60) return '#FF9800';
    return '#FF5722';
  };

  const getMetricColor = (value: number, isInverse = false) => {
    if (isInverse) {
      if (value <= 20) return '#4CAF50';
      if (value <= 50) return '#FF9800';
      return '#FF5722';
    } else {
      if (value >= 80) return '#4CAF50';
      if (value >= 60) return '#FF9800';
      return '#FF5722';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#2E7D32', '#4CAF50']}
        style={styles.header}>
        <Text style={styles.headerTitle}>Crop Analysis</Text>
        <Text style={styles.headerSubtitle}>AI-powered health insights</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Analysis Selector */}
        <View style={styles.selectorContainer}>
          {analyses.map((analysis, index) => (
            <TouchableOpacity
              key={analysis.id}
              style={[
                styles.selectorTab,
                index === selectedAnalysis && styles.selectorTabActive
              ]}
              onPress={() => setSelectedAnalysis(index)}
            >
              <Text style={[
                styles.selectorTabText,
                index === selectedAnalysis && styles.selectorTabTextActive
              ]}>
                {analysis.cropName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Overall Health Score */}
        <View style={styles.healthCard}>
          <View style={styles.healthHeader}>
            <Activity size={24} color={getHealthColor(currentAnalysis.overallHealth)} />
            <Text style={styles.healthTitle}>Overall Health Score</Text>
            <Text style={styles.timestamp}>
              <Clock size={12} color="#666" /> {currentAnalysis.timestamp}
            </Text>
          </View>
          
          <View style={styles.healthScoreContainer}>
            <Text style={[styles.healthScore, { color: getHealthColor(currentAnalysis.overallHealth) }]}>
              {currentAnalysis.overallHealth}%
            </Text>
            <View style={styles.healthBar}>
              <View 
                style={[
                  styles.healthBarFill, 
                  { 
                    width: `${currentAnalysis.overallHealth}%`,
                    backgroundColor: getHealthColor(currentAnalysis.overallHealth)
                  }
                ]} 
              />
            </View>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: getHealthColor(currentAnalysis.overallHealth) + '20' }]}>
            {currentAnalysis.status === 'healthy' ? (
              <CheckCircle size={16} color={getHealthColor(currentAnalysis.overallHealth)} />
            ) : (
              <AlertTriangle size={16} color={getHealthColor(currentAnalysis.overallHealth)} />
            )}
            <Text style={[styles.statusText, { color: getHealthColor(currentAnalysis.overallHealth) }]}>
              {currentAnalysis.status.charAt(0).toUpperCase() + currentAnalysis.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Metrics Grid */}
        <Text style={styles.sectionTitle}>Health Metrics</Text>
        <View style={styles.metricsGrid}>
          {currentAnalysis.metrics.map((metric, index) => (
            <View key={index} style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
                <metric.icon size={20} color={metric.color} />
              </View>
              <Text style={styles.metricValue}>
                {metric.value}%
              </Text>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <View style={styles.metricBar}>
                <View 
                  style={[
                    styles.metricBarFill, 
                    { 
                      width: `${metric.value}%`,
                      backgroundColor: getMetricColor(
                        metric.value, 
                        metric.label === 'Water Stress' || metric.label === 'Pest Risk'
                      )
                    }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>

        {/* Issues Detected */}
        <Text style={styles.sectionTitle}>Issues Detected</Text>
        {currentAnalysis.issues.map((issue, index) => (
          <View key={index} style={styles.issueCard}>
            <View style={styles.issueHeader}>
              <View style={[styles.issueIcon, { backgroundColor: issue.color + '20' }]}>
                <issue.icon size={20} color={issue.color} />
              </View>
              <View style={styles.issueInfo}>
                <Text style={styles.issueType}>{issue.type}</Text>
                <View style={styles.issueMeta}>
                  <Text style={[styles.issueSeverity, { color: issue.color }]}>
                    {issue.severity} Severity
                  </Text>
                  <Text style={styles.issueConfidence}>
                    {issue.confidence}% confidence
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.issueDescription}>{issue.description}</Text>
            <View style={styles.recommendationCard}>
              <Text style={styles.recommendationTitle}>Recommendation:</Text>
              <Text style={styles.recommendationText}>{issue.recommendation}</Text>
            </View>
          </View>
        ))}

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <TrendingUp size={20} color="#4CAF50" />
            <Text style={styles.actionButtonText}>View Trends</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Activity size={20} color="#2196F3" />
            <Text style={styles.actionButtonText}>Detailed Report</Text>
          </TouchableOpacity>
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
  selectorContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectorTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectorTabActive: {
    backgroundColor: '#4CAF50',
  },
  selectorTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  selectorTabTextActive: {
    color: 'white',
  },
  healthCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  healthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  healthScoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  healthScore: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  healthBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  healthBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  metricCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: (width - 50) / 2,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  metricBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  metricBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  issueCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  issueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  issueIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  issueInfo: {
    flex: 1,
  },
  issueType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  issueMeta: {
    flexDirection: 'row',
    gap: 15,
  },
  issueSeverity: {
    fontSize: 12,
    fontWeight: '600',
  },
  issueConfidence: {
    fontSize: 12,
    color: '#666',
  },
  issueDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  recommendationCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
});