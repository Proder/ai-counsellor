
MOCK_DATA = [
    # USA - Ivy & Top Tier (Dream/Reach for most)
    {"id": 1, "school.name": "Stanford University", "school.city": "Stanford", "school.state": "CA", "school.country": "USA", "latest.cost.tuition.out_of_state": 65000, "latest.admissions.admission_rate.overall": 0.04, "website": "https://www.stanford.edu"},
    {"id": 2, "school.name": "Massachusetts Institute of Technology (MIT)", "school.city": "Cambridge", "school.state": "MA", "school.country": "USA", "latest.cost.tuition.out_of_state": 62000, "latest.admissions.admission_rate.overall": 0.04, "website": "https://www.mit.edu"},
    {"id": 3, "school.name": "Harvard University", "school.city": "Cambridge", "school.state": "MA", "school.country": "USA", "latest.cost.tuition.out_of_state": 60000, "latest.admissions.admission_rate.overall": 0.03, "website": "https://www.harvard.edu"},
    {"id": 4, "school.name": "Princeton University", "school.city": "Princeton", "school.state": "NJ", "school.country": "USA", "latest.cost.tuition.out_of_state": 59000, "latest.admissions.admission_rate.overall": 0.04, "website": "https://www.princeton.edu"},
    {"id": 5, "school.name": "Yale University", "school.city": "New Haven", "school.state": "CT", "school.country": "USA", "latest.cost.tuition.out_of_state": 65000, "latest.admissions.admission_rate.overall": 0.05, "website": "https://www.yale.edu"},
    {"id": 6, "school.name": "Columbia University", "school.city": "New York", "school.state": "NY", "school.country": "USA", "latest.cost.tuition.out_of_state": 68000, "latest.admissions.admission_rate.overall": 0.04, "website": "https://www.columbia.edu"},
    {"id": 7, "school.name": "California Institute of Technology (Caltech)", "school.city": "Pasadena", "school.state": "CA", "school.country": "USA", "latest.cost.tuition.out_of_state": 63000, "latest.admissions.admission_rate.overall": 0.03, "website": "https://www.caltech.edu"},
    
    # USA - Top Public / Target
    {"id": 32, "school.name": "University of Michigan", "school.city": "Ann Arbor", "school.state": "MI", "school.country": "USA", "latest.cost.tuition.out_of_state": 55000, "latest.admissions.admission_rate.overall": 0.18, "website": "https://umich.edu"},
    {"id": 33, "school.name": "UT Austin", "school.city": "Austin", "school.state": "TX", "school.country": "USA", "latest.cost.tuition.out_of_state": 42000, "latest.admissions.admission_rate.overall": 0.29, "website": "https://www.utexas.edu"},
    {"id": 34, "school.name": "Georgia Institute of Technology", "school.city": "Atlanta", "school.state": "GA", "school.country": "USA", "latest.cost.tuition.out_of_state": 33000, "latest.admissions.admission_rate.overall": 0.16, "website": "https://www.gatech.edu"},
    {"id": 35, "school.name": "University of California, Los Angeles (UCLA)", "school.city": "Los Angeles", "school.state": "CA", "school.country": "USA", "latest.cost.tuition.out_of_state": 46000, "latest.admissions.admission_rate.overall": 0.09, "website": "https://www.ucla.edu"},
    {"id": 36, "school.name": "University of California, Berkeley", "school.city": "Berkeley", "school.state": "CA", "school.country": "USA", "latest.cost.tuition.out_of_state": 48000, "latest.admissions.admission_rate.overall": 0.11, "website": "https://www.berkeley.edu"},
    
    # USA - Safe/Moderate
    {"id": 37, "school.name": "Purdue University", "school.city": "West Lafayette", "school.state": "IN", "school.country": "USA", "latest.cost.tuition.out_of_state": 28000, "latest.admissions.admission_rate.overall": 0.53, "website": "https://www.purdue.edu"},
    {"id": 38, "school.name": "University of Illinois Urbana-Champaign", "school.city": "Urbana", "school.state": "IL", "school.country": "USA", "latest.cost.tuition.out_of_state": 35000, "latest.admissions.admission_rate.overall": 0.45, "website": "https://illinois.edu"},
    {"id": 39, "school.name": "Arizona State University", "school.city": "Tempe", "school.state": "AZ", "school.country": "USA", "latest.cost.tuition.out_of_state": 32000, "latest.admissions.admission_rate.overall": 0.89, "website": "https://www.asu.edu"},
    {"id": 40, "school.name": "University of Florida", "school.city": "Gainesville", "school.state": "FL", "school.country": "USA", "latest.cost.tuition.out_of_state": 28000, "latest.admissions.admission_rate.overall": 0.23, "website": "https://www.ufl.edu"},

    # UK - Top & Russell Group
    {"id": 50, "school.name": "University of Oxford", "school.city": "Oxford", "school.state": "OX", "school.country": "UK", "latest.cost.tuition.out_of_state": 45000, "latest.admissions.admission_rate.overall": 0.14, "website": "https://www.ox.ac.uk"},
    {"id": 51, "school.name": "University of Cambridge", "school.city": "Cambridge", "school.state": "CB", "school.country": "UK", "latest.cost.tuition.out_of_state": 46000, "latest.admissions.admission_rate.overall": 0.16, "website": "https://www.cam.ac.uk"},
    {"id": 52, "school.name": "Imperial College London", "school.city": "London", "school.state": "LDN", "school.country": "UK", "latest.cost.tuition.out_of_state": 42000, "latest.admissions.admission_rate.overall": 0.15, "website": "https://www.imperial.ac.uk"},
    {"id": 53, "school.name": "University College London (UCL)", "school.city": "London", "school.state": "LDN", "school.country": "UK", "latest.cost.tuition.out_of_state": 38000, "latest.admissions.admission_rate.overall": 0.30, "website": "https://www.ucl.ac.uk"},
    {"id": 54, "school.name": "University of Manchester", "school.city": "Manchester", "school.state": "MAN", "school.country": "UK", "latest.cost.tuition.out_of_state": 32000, "latest.admissions.admission_rate.overall": 0.50, "website": "https://www.manchester.ac.uk"},

    # Canada
    {"id": 60, "school.name": "University of Toronto", "school.city": "Toronto", "school.state": "ON", "school.country": "Canada", "latest.cost.tuition.out_of_state": 45000, "latest.admissions.admission_rate.overall": 0.43, "website": "https://www.utoronto.ca"},
    {"id": 61, "school.name": "University of British Columbia", "school.city": "Vancouver", "school.state": "BC", "school.country": "Canada", "latest.cost.tuition.out_of_state": 38000, "latest.admissions.admission_rate.overall": 0.52, "website": "https://www.ubc.ca"},
    {"id": 62, "school.name": "McGill University", "school.city": "Montreal", "school.state": "QC", "school.country": "Canada", "latest.cost.tuition.out_of_state": 35000, "latest.admissions.admission_rate.overall": 0.46, "website": "https://www.mcgill.ca"},
    {"id": 63, "school.name": "University of Waterloo", "school.city": "Waterloo", "school.state": "ON", "school.country": "Canada", "latest.cost.tuition.out_of_state": 32000, "latest.admissions.admission_rate.overall": 0.53, "website": "https://uwaterloo.ca"},

    # Europe
    {"id": 70, "school.name": "ETH Zurich", "school.city": "Zurich", "school.state": "ZH", "school.country": "Switzerland", "latest.cost.tuition.out_of_state": 2000, "latest.admissions.admission_rate.overall": 0.27, "website": "https://ethz.ch"},
    {"id": 71, "school.name": "EPFL", "school.city": "Lausanne", "school.state": "VD", "school.country": "Switzerland", "latest.cost.tuition.out_of_state": 2000, "latest.admissions.admission_rate.overall": 0.20, "website": "https://www.epfl.ch"},
    {"id": 72, "school.name": "TU Munich", "school.city": "Munich", "school.state": "BY", "school.country": "Germany", "latest.cost.tuition.out_of_state": 0, "latest.admissions.admission_rate.overall": 0.08, "website": "https://www.tum.de"},
    {"id": 73, "school.name": "Technical University of Berlin", "school.city": "Berlin", "school.state": "BE", "school.country": "Germany", "latest.cost.tuition.out_of_state": 0, "latest.admissions.admission_rate.overall": 0.08, "website": "https://www.tu.berlin"},
    {"id": 76, "school.name": "University of Hamburg", "school.city": "Hamburg", "school.state": "HH", "school.country": "Germany", "latest.cost.tuition.out_of_state": 0, "latest.admissions.admission_rate.overall": 0.08, "website": "https://www.uni-hamburg.de"},
    {"id": 78, "school.name": "University of Frankfurt", "school.city": "Frankfurt", "school.state": "HE", "school.country": "Germany", "latest.cost.tuition.out_of_state": 0, "latest.admissions.admission_rate.overall": 0.08, "website": "https://www.uni-frankfurt.de"},
    {"id": 79, "school.name": "University of Stuttgart", "school.city": "Stuttgart", "school.state": "BW", "school.country": "Germany", "latest.cost.tuition.out_of_state": 0, "latest.admissions.admission_rate.overall": 0.08, "website": "https://www.uni-stuttgart.de"},
    
    # Singapre/Aus
    {"id": 80, "school.name": "National University of Singapore (NUS)", "school.city": "Singapore", "school.state": "SG", "school.country": "Singapore", "latest.cost.tuition.out_of_state": 25000, "latest.admissions.admission_rate.overall": 0.05, "website": "https://nus.edu.sg"},
    {"id": 81, "school.name": "University of Melbourne", "school.city": "Melbourne", "school.state": "VIC", "school.country": "Australia", "latest.cost.tuition.out_of_state": 35000, "latest.admissions.admission_rate.overall": 0.70, "website": "https://www.unimelb.edu.au"},

    # China
    {"id": 90, "school.name": "Tsinghua University", "school.city": "Beijing", "school.state": "BJ", "school.country": "China", "latest.cost.tuition.out_of_state": 25000, "latest.admissions.admission_rate.overall": 0.05, "website": "https://www.tsinghua.edu.cn"},
    {"id": 91, "school.name": "Peking University", "school.city": "Beijing", "school.state": "BJ", "school.country": "China", "latest.cost.tuition.out_of_state": 25000, "latest.admissions.admission_rate.overall": 0.05, "website": "https://www.pku.edu.cn"},
    {"id": 92, "school.name": "Shanghai Jiao Tong University", "school.city": "Shanghai", "school.state": "SH", "school.country": "China", "latest.cost.tuition.out_of_state": 25000, "latest.admissions.admission_rate.overall": 0.05, "website": "https://www.sjtu.edu.cn"},
    {"id": 93, "school.name": "Zhejiang University", "school.city": "Hangzhou", "school.state": "HZ", "school.country": "China", "latest.cost.tuition.out_of_state": 25000, "latest.admissions.admission_rate.overall": 0.05, "website": "https://www.zju.edu.cn"},

]
