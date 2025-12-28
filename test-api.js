// Simple API test script
// Run this to test the updated API endpoints

const API_BASE = 'http://localhost:8080/api/v1';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User'
};

// Helper function to make requests
async function request(method, endpoint, data = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const json = await response.json();
    return { status: response.status, data: json };
  } catch (error) {
    return { status: 0, error: error.message };
  }
}

// Test scenarios
async function runTests() {
  console.log('=== API Endpoint Test ===\n');

  // 1. Test login
  console.log('1. Testing Login...');
  const loginResponse = await request('POST', '/auth/login', {
    email: testUser.email,
    password: testUser.password
  });

  if (loginResponse.status === 200) {
    console.log('✅ Login successful');
    console.log('   Response structure:', Object.keys(loginResponse.data));
    const token = loginResponse.data.accessToken || loginResponse.data.token;

    if (!token) {
      console.log('❌ No token in response');
      return;
    }

    console.log('   Token:', token.substring(0, 20) + '...');

    // 2. Test /auth/me
    console.log('\n2. Testing /auth/me...');
    const meResponse = await request('GET', '/auth/me', null, token);
    if (meResponse.status === 200) {
      console.log('✅ /auth/me successful');
      console.log('   User:', meResponse.data);
    } else {
      console.log('❌ /auth/me failed:', meResponse.status, meResponse.data);
    }

    // 3. Test current plan
    console.log('\n3. Testing /plans/current...');
    const planResponse = await request('GET', '/plans/current', null, token);
    if (planResponse.status === 200) {
      console.log('✅ /plans/current successful');
      const plan = planResponse.data;
      console.log('   Plan ID:', plan.id);
      console.log('   Status:', plan.status);
      console.log('   Week:', plan.weekStartDate, '-', plan.weekEndDate);

      // 4. Test task creation
      console.log('\n4. Testing task creation...');
      const taskResponse = await request(
        'POST',
        `/plans/${plan.id}/tasks?date=${plan.weekStartDate}`,
        {
          title: 'Test Task',
          description: 'Testing API',
          priority: 'MEDIUM'
        },
        token
      );

      if (taskResponse.status === 201 || taskResponse.status === 200) {
        console.log('✅ Task created successfully');
        const task = taskResponse.data;
        console.log('   Task ID:', task.id);

        // 5. Test task update
        console.log('\n5. Testing task update...');
        const updateResponse = await request(
          'PUT',
          `/plans/${plan.id}/tasks/${task.id}`,
          {
            status: 'IN_PROGRESS',
            reason: 'Starting work'
          },
          token
        );

        if (updateResponse.status === 200) {
          console.log('✅ Task updated successfully');
        } else {
          console.log('❌ Task update failed:', updateResponse.status);
        }

        // 6. Test task move
        console.log('\n6. Testing task move...');
        const targetDate = new Date(plan.weekStartDate);
        targetDate.setDate(targetDate.getDate() + 1);
        const moveResponse = await request(
          'POST',
          `/plans/${plan.id}/tasks/${task.id}/move`,
          {
            targetDate: targetDate.toISOString().split('T')[0],
            reason: 'Postponed'
          },
          token
        );

        if (moveResponse.status === 200) {
          console.log('✅ Task moved successfully');
        } else {
          console.log('❌ Task move failed:', moveResponse.status);
        }

        // 7. Test task delete
        console.log('\n7. Testing task delete...');
        const deleteResponse = await request(
          'DELETE',
          `/plans/${plan.id}/tasks/${task.id}`,
          null,
          token
        );

        if (deleteResponse.status === 200 || deleteResponse.status === 204) {
          console.log('✅ Task deleted successfully');
        } else {
          console.log('❌ Task delete failed:', deleteResponse.status);
        }
      } else {
        console.log('❌ Task creation failed:', taskResponse.status);
        console.log('   Response:', taskResponse.data);
      }

      // 8. Test plan confirm
      if (plan.status === 'DRAFT') {
        console.log('\n8. Testing plan confirm...');
        const confirmResponse = await request(
          'POST',
          `/plans/${plan.id}/confirm`,
          null,
          token
        );

        if (confirmResponse.status === 200) {
          console.log('✅ Plan confirmed successfully');
        } else {
          console.log('❌ Plan confirm failed:', confirmResponse.status);
        }
      }

      // 9. Test review endpoint
      console.log('\n9. Testing review endpoints...');
      const reviewResponse = await request(
        'GET',
        `/plans/${plan.id}/review`,
        null,
        token
      );

      if (reviewResponse.status === 200) {
        console.log('✅ Review endpoint works');
      } else {
        console.log('❌ Review endpoint failed:', reviewResponse.status);
      }

      // 10. Test changes endpoint
      console.log('\n10. Testing changes endpoint...');
      const changesResponse = await request(
        'GET',
        `/plans/${plan.id}/changes`,
        null,
        token
      );

      if (changesResponse.status === 200) {
        console.log('✅ Changes endpoint works');
      } else {
        console.log('❌ Changes endpoint failed:', changesResponse.status);
      }

    } else {
      console.log('❌ /plans/current failed:', planResponse.status, planResponse.data);
    }

    // 11. Test notifications
    console.log('\n11. Testing notification endpoints...');
    const notifResponse = await request('GET', '/notifications', null, token);
    if (notifResponse.status === 200) {
      console.log('✅ GET /notifications works');

      // Test mark all as read
      const markAllResponse = await request('POST', '/notifications/read-all', null, token);
      if (markAllResponse.status === 200 || markAllResponse.status === 204) {
        console.log('✅ POST /notifications/read-all works');
      } else {
        console.log('❌ POST /notifications/read-all failed:', markAllResponse.status);
      }
    } else {
      console.log('❌ GET /notifications failed:', notifResponse.status);
    }

  } else {
    console.log('❌ Login failed:', loginResponse.status);
    console.log('   Response:', loginResponse.data);
  }

  console.log('\n=== Test Complete ===');
}

// Run tests with Node.js
if (typeof module !== 'undefined' && require.main === module) {
  runTests().catch(console.error);
}